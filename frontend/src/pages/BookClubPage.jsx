import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  LoaderCircle,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Send,
  Settings2,
  Smile,
  Users,
  X,
} from 'lucide-react';
import { apiClient, socketServerUrl } from '../lib/api';
import { DEMO_CLUB_ID, DEMO_USER_ID } from '../lib/bookClubDemo';

const formatTime = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('-');

const BookClubPage = ({ onConfigureApi }) => {
  const [club, setClub] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [activeChapter, setActiveChapter] = useState(null);
  const [message, setMessage] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingChapter, setIsUpdatingChapter] = useState(null);
  const [isInviting, setIsInviting] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    bookTitle: '',
    bookAuthor: '',
    bookStatus: 'Done',
  });

  const activeChapterRef = useRef(activeChapter);
  const messagesEndRef = useRef(null);

  const totalChapters = club?.chapters?.length || 0;
  const completedCount = completedChapters.length;
  const currentChapter = club?.chapters?.find((chapter) => chapter.number === activeChapter) || null;

  const hydrateClub = (payload) => {
    setClub(payload.club);
    setCurrentUser(payload.viewer);
    setCompletedChapters(payload.viewerProgress || []);
    setInviteLink(payload.club.inviteLink || '');
    setSettingsForm({
      name: payload.club.name || '',
      bookTitle: payload.club.book?.title || '',
      bookAuthor: payload.club.book?.author || '',
      bookStatus: payload.club.book?.status || 'Done',
    });
  };

  const fetchContributors = async () => {
    const response = await apiClient.get(`/contributors/${DEMO_CLUB_ID}`);
    setContributors(response.data);
  };

  const fetchMessages = async (chapterNumber) => {
    setChatLoading(true);

    try {
      const response = await apiClient.get(`/messages/${DEMO_CLUB_ID}`, {
        params: chapterNumber ? { chapter: chapterNumber } : {},
      });
      setMessages(response.data);
    } catch (fetchError) {
      toast.error(fetchError.response?.data?.message || 'Unable to load discussion messages.');
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    activeChapterRef.current = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    let isMounted = true;

    const fetchClubData = async () => {
      try {
        setLoading(true);
        setError('');

        const [clubResponse, contributorsResponse] = await Promise.all([
          apiClient.get(`/clubs/${DEMO_CLUB_ID}`, {
            params: { userId: DEMO_USER_ID },
          }),
          apiClient.get(`/contributors/${DEMO_CLUB_ID}`),
        ]);

        if (!isMounted) {
          return;
        }

        hydrateClub(clubResponse.data);
        setContributors(contributorsResponse.data);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(fetchError.response?.data?.message || 'Unable to load the club right now.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClubData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchMessages(activeChapter);
  }, [activeChapter]);

  useEffect(() => {
    const socket = io(socketServerUrl, {
      transports: ['websocket'],
    });

    socket.emit('join_club', DEMO_CLUB_ID);
    socket.on('message:created', (incomingMessage) => {
      const incomingChapter = incomingMessage.chapterNumber ?? null;
      const currentFilter = activeChapterRef.current ?? null;

      if (incomingChapter !== currentFilter) {
        return;
      }

      setMessages((previousMessages) => {
        if (previousMessages.some((entry) => entry._id === incomingMessage._id)) {
          return previousMessages;
        }

        return [...previousMessages, incomingMessage];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateContributorPoints = (increment) => {
    if (!currentUser) {
      return;
    }

    setContributors((previousContributors) => {
      const existingContributor = previousContributors.find(
        (entry) => entry.user._id === currentUser._id
      );

      if (!existingContributor) {
        return [
          ...previousContributors,
          {
            _id: `${currentUser._id}-local`,
            clubId: DEMO_CLUB_ID,
            points: increment,
            user: currentUser,
          },
        ].sort((first, second) => second.points - first.points);
      }

      return previousContributors
        .map((entry) =>
          entry.user._id === currentUser._id
            ? { ...entry, points: entry.points + increment }
            : entry
        )
        .sort((first, second) => second.points - first.points);
    });
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    try {
      setIsSending(true);
      const response = await apiClient.post('/messages', {
        clubId: DEMO_CLUB_ID,
        userId: DEMO_USER_ID,
        text: trimmedMessage,
        chapterNumber: activeChapter || null,
      });

      setMessage('');
      setMessages((previousMessages) => {
        if (previousMessages.some((entry) => entry._id === response.data._id)) {
          return previousMessages;
        }

        return [...previousMessages, response.data];
      });
      updateContributorPoints(5);
    } catch (sendError) {
      toast.error(sendError.response?.data?.message || 'Unable to send the message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkChapterComplete = async (chapterNumber) => {
    try {
      setIsUpdatingChapter(chapterNumber);
      const response = await apiClient.post('/progress', {
        userId: DEMO_USER_ID,
        clubId: DEMO_CLUB_ID,
        chapterNumber,
      });

      setCompletedChapters(response.data.completedChapters || []);
      updateContributorPoints(2);
      toast.success(`Chapter ${chapterNumber} marked as completed.`);
      fetchContributors();
    } catch (progressError) {
      toast.error(progressError.response?.data?.message || 'Unable to save progress.');
    } finally {
      setIsUpdatingChapter(null);
    }
  };

  const handleInvite = async () => {
    try {
      setIsInviting(true);
      const response = await apiClient.post('/invite', { clubId: DEMO_CLUB_ID });
      const nextInviteLink = response.data.inviteLink;

      setInviteLink(nextInviteLink);

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(nextInviteLink);
        toast.success('Invite link copied to clipboard.');
      } else {
        toast.success('Invite link generated.');
      }
    } catch (inviteError) {
      toast.error(inviteError.response?.data?.message || 'Unable to generate invite link.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleSaveSettings = async (event) => {
    event.preventDefault();

    try {
      setIsSavingSettings(true);
      const response = await apiClient.patch(`/clubs/${DEMO_CLUB_ID}`, {
        name: settingsForm.name,
        book: {
          title: settingsForm.bookTitle,
          author: settingsForm.bookAuthor,
          status: settingsForm.bookStatus,
        },
      });

      setClub(response.data);
      setInviteLink(response.data.inviteLink || inviteLink);
      setIsSettingsOpen(false);
      toast.success('Club settings updated.');
    } catch (settingsError) {
      toast.error(settingsError.response?.data?.message || 'Unable to update club settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 rounded-2xl border border-[#1f3b26] bg-[#07100a] px-5 py-4 text-sm text-[#bbf7d0]">
          <LoaderCircle className="animate-spin text-primary-400" size={18} />
          Loading club dashboard...
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-4 py-10">
        <div className="max-w-md rounded-3xl border border-[#2d3f34] bg-[#07100a] p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle size={40} />
            </div>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-[#ecfccb]">Book club unavailable</h2>
          <p className="mb-8 text-sm text-[#86efac] leading-relaxed">
            {error || 'We could not load this club just now.'}
            <br />
            This usually happens if the backend API is disconnected or the URL is incorrect.
          </p>
          <button
            onClick={onConfigureApi}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(34,197,94,0.2)] transition hover:bg-primary-500 active:scale-95"
          >
            <Settings2 size={18} />
            Configure Backend API
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-auto lg:h-[700px] max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-[2rem] border border-[#1f3b26] bg-[#050c07] p-5 lg:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-[#d9f99d] text-2xl font-bold text-[#16a34a] shadow-[0_12px_36px_rgba(34,197,94,0.15)]">
              {getInitials(club.name)}
            </div>
            <div>
              <h1 className="mb-1 text-2xl font-bold text-[#f0fdf4]">{club.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#86efac]">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-primary-400" />
                  {club.memberCount} Members
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary-400" />
                  Reading: {club.book.title}
                </span>
                <span className="rounded-full border border-[#1f3b26] bg-[#08110b] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#bbf7d0]">
                  {club.book.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#1f3b26] bg-[#07100a] px-5 py-3 text-sm font-semibold text-[#d9f99d] transition hover:border-primary-500 hover:text-white"
            >
              <Settings2 size={16} />
              Club Settings
            </button>
            <button
              onClick={handleInvite}
              disabled={isInviting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,197,94,0.35)] transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isInviting ? <LoaderCircle className="animate-spin" size={16} /> : <Copy size={16} />}
              Invite Friend
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#86efac]">
          <span className="rounded-full border border-[#1f3b26] bg-[#08110b] px-3 py-1">
            Progress: {completedCount}/{totalChapters} chapters
          </span>
          {inviteLink ? (
            <span className="max-w-full truncate rounded-full border border-[#1f3b26] bg-[#08110b] px-3 py-1 text-[#4ade80]">
              {inviteLink}
            </span>
          ) : null}
        </div>
      </motion.div>

      <div className="mb-6 grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6 overflow-y-auto pr-1">
          <section className="rounded-[1.8rem] border border-[#1f3b26] bg-[#050c07] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#f0fdf4]">Reading Progress</h3>
              <button
                onClick={() => setActiveChapter(null)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  activeChapter === null
                    ? 'bg-primary-600 text-white'
                    : 'border border-[#1f3b26] bg-[#08110b] text-[#86efac] hover:text-white'
                }`}
              >
                General
              </button>
            </div>

            <div className="space-y-3">
              {club.chapters.map((chapter) => {
                const isCompleted = completedChapters.includes(chapter.number);
                const isActive = activeChapter === chapter.number;

                return (
                  <div
                    key={chapter.number}
                    className={`rounded-2xl border px-4 py-3 transition ${
                      isActive
                        ? 'border-primary-500 bg-[rgba(34,197,94,0.12)]'
                        : 'border-[#16261b] bg-[#08110b]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => setActiveChapter(chapter.number)}
                        className="text-left"
                      >
                        <p className={`text-sm font-semibold ${isCompleted ? 'text-[#dcfce7]' : 'text-[#86efac]'}`}>
                          Chapter {chapter.number}
                        </p>
                        <p className="mt-1 text-xs text-[#4ade80]">{chapter.title}</p>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveChapter(chapter.number)}
                          className="rounded-full border border-[#1f3b26] px-3 py-1 text-xs font-semibold text-[#bbf7d0] transition hover:border-primary-500 hover:text-white"
                        >
                          Discuss
                        </button>
                        <button
                          onClick={() => handleMarkChapterComplete(chapter.number)}
                          disabled={isUpdatingChapter === chapter.number || isCompleted}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            isCompleted
                              ? 'border-primary-500 bg-primary-600 text-white'
                              : 'border-[#1f3b26] bg-[#08110b] text-[#86efac] hover:border-primary-500 hover:text-white'
                          } disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                          {isUpdatingChapter === chapter.number ? (
                            <LoaderCircle className="animate-spin" size={15} />
                          ) : isCompleted ? (
                            <Check size={15} />
                          ) : (
                            <CheckCircle2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-[#1f3b26] bg-[#050c07] p-5">
            <h3 className="mb-4 text-lg font-bold text-[#f0fdf4]">Top Contributors</h3>
            <div className="space-y-4 text-sm">
              {contributors.map((contributor) => (
                <div key={contributor._id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-[#1f3b26] bg-[#0b120d]">
                      {contributor.user.avatar ? (
                        <img
                          src={contributor.user.avatar}
                          alt={contributor.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#bbf7d0]">
                          {getInitials(contributor.user.name)}
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-[#dcfce7]">{contributor.user.name}</span>
                  </div>
                  <span className="font-semibold text-[#4ade80]">{contributor.points} pts</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="flex flex-col min-h-[400px] lg:min-h-0 overflow-hidden rounded-[2rem] border border-[#1f3b26] bg-[#050c07] shadow-lg flex-1">
          <div className="flex items-center justify-between border-b border-[#17311f] px-6 py-4">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-primary-400" />
              <div>
                <h2 className="font-bold text-[#f0fdf4]">
                  {currentChapter ? `Chapter ${currentChapter.number} Discussion` : 'General Discussion'}
                </h2>
                <p className="text-xs text-[#4ade80]">
                  {currentChapter ? currentChapter.title : 'Full club conversation'}
                </p>
              </div>
            </div>

            <button className="text-[#4ade80] transition hover:text-white">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-5 flex justify-center">
              <span className="rounded-full border border-[#1f3b26] bg-[#08110b] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4ade80]">
                {currentChapter ? `Focused on Chapter ${currentChapter.number}` : 'Conversation Started Today'}
              </span>
            </div>

            {chatLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex items-center gap-3 rounded-2xl border border-[#1f3b26] bg-[#08110b] px-5 py-4 text-sm text-[#bbf7d0]">
                  <LoaderCircle className="animate-spin text-primary-400" size={18} />
                  Loading discussion...
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-sm rounded-3xl border border-dashed border-[#21422c] bg-[#08110b] px-8 py-10 text-center">
                  <h3 className="mb-2 text-lg font-semibold text-[#ecfccb]">No messages yet</h3>
                  <p className="text-sm text-[#86efac]">
                    Start the conversation for {currentChapter ? `Chapter ${currentChapter.number}` : 'the club'}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((entry) => {
                  const isOwnMessage = currentUser?._id === entry.user._id;

                  return (
                    <div
                      key={entry._id}
                      className={`flex items-start gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="mt-1 h-10 w-10 overflow-hidden rounded-2xl border border-[#1f3b26] bg-[#08110b]">
                        {entry.user.avatar ? (
                          <img
                            src={entry.user.avatar}
                            alt={entry.user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#bbf7d0]">
                            {getInitials(entry.user.name)}
                          </div>
                        )}
                      </div>

                      <div className={`flex max-w-[80%] flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                        <div className="mb-1 flex items-center gap-2 text-xs">
                          <span className="font-bold text-[#dcfce7]">{entry.user.name}</span>
                          <span className="text-[#4ade80]">{formatTime(entry.createdAt)}</span>
                        </div>
                        <div
                          className={`rounded-[1.4rem] px-4 py-3 text-sm leading-relaxed border ${
                            isOwnMessage
                              ? 'rounded-tr-md bg-primary-600 text-white border-primary-500 shadow-[0_18px_36px_rgba(34,197,94,0.18)]'
                              : 'rounded-tl-md border-[#2d4d35] bg-[#0c1a10] text-[#e2fceb]'
                          }`}
                        >
                          {entry.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-[#17311f] p-4">
            <div className="flex items-center rounded-[1.8rem] border border-[#1f3b26] bg-[#08110b] px-5 py-3 transition focus-within:border-primary-500 shadow-inner">
              <button className="mr-3 text-[#4ade80] transition hover:text-white">
                <Paperclip size={18} />
              </button>

              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  currentChapter
                    ? `Share your Chapter ${currentChapter.number} thoughts...`
                    : 'Type your discussion points...'
                }
                className="flex-1 bg-transparent py-3 text-base text-[#f0fdf4] placeholder:text-[#4ade80] focus:outline-none"
              />

              <div className="ml-3 flex items-center gap-3">
                <button className="text-[#4ade80] transition hover:text-white">
                  <Smile size={18} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !message.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSending ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isSettingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-[2rem] border border-[#1f3b26] bg-[#050c07] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#f0fdf4]">Club Settings</h2>
                <p className="text-sm text-[#86efac]">Update the club name or the current book details.</p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f3b26] bg-[#08110b] text-[#86efac] transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSaveSettings}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#dcfce7]">Club name</span>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(event) =>
                    setSettingsForm((previous) => ({ ...previous, name: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#1f3b26] bg-[#08110b] px-4 py-3 text-sm text-[#f0fdf4] focus:border-primary-500 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#dcfce7]">Book title</span>
                <input
                  type="text"
                  value={settingsForm.bookTitle}
                  onChange={(event) =>
                    setSettingsForm((previous) => ({ ...previous, bookTitle: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#1f3b26] bg-[#08110b] px-4 py-3 text-sm text-[#f0fdf4] focus:border-primary-500 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#dcfce7]">Book author</span>
                <input
                  type="text"
                  value={settingsForm.bookAuthor}
                  onChange={(event) =>
                    setSettingsForm((previous) => ({ ...previous, bookAuthor: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#1f3b26] bg-[#08110b] px-4 py-3 text-sm text-[#f0fdf4] focus:border-primary-500 focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#dcfce7]">Reading status</span>
                <select
                  value={settingsForm.bookStatus}
                  onChange={(event) =>
                    setSettingsForm((previous) => ({ ...previous, bookStatus: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#1f3b26] bg-[#08110b] px-4 py-3 text-sm text-[#f0fdf4] focus:border-primary-500 focus:outline-none"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Starting Soon">Starting Soon</option>
                </select>
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-2xl border border-[#1f3b26] bg-[#08110b] px-5 py-3 text-sm font-semibold text-[#d9f99d] transition hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingSettings ? <LoaderCircle className="animate-spin" size={16} /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BookClubPage;
