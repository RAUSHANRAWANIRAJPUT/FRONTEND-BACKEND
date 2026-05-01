import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  ArrowLeft,
  LoaderCircle,
  MessageCircle,
  Send,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { discussionApi, socketServerUrl } from '../lib/api';

const DEFAULT_ROOM_ID = 'readtogether-general';
const STORAGE_KEY = 'readtogether_discussion_room';

const normalizeRoomId = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

const getStoredRoomPreferences = () => {
  if (typeof window === 'undefined') {
    return { roomId: DEFAULT_ROOM_ID, displayName: '' };
  }

  try {
    const storedValue = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      roomId: storedValue.roomId || DEFAULT_ROOM_ID,
      displayName: storedValue.displayName || '',
    };
  } catch {
    return { roomId: DEFAULT_ROOM_ID, displayName: '' };
  }
};

const formatMessageTime = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const DiscussionRoomPage = ({ setActivePage, user }) => {
  const storedRoomPreferences = getStoredRoomPreferences();
  const userId = String(user?.id || user?._id || '').trim();
  const suggestedName = user?.name || storedRoomPreferences.displayName || '';

  const [displayName, setDisplayName] = useState(suggestedName);
  const [roomIdInput, setRoomIdInput] = useState(storedRoomPreferences.roomId || DEFAULT_ROOM_ID);
  const [joinedRoomId, setJoinedRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const socketRef = useRef(null);
  const joinedRoomIdRef = useRef('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    joinedRoomIdRef.current = joinedRoomId;
  }, [joinedRoomId]);

  useEffect(() => {
    const socket = io(socketServerUrl, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('discussion_message_created', (incomingMessage) => {
      if (incomingMessage.roomId !== joinedRoomIdRef.current) {
        return;
      }

      setMessages((previousMessages) => {
        if (previousMessages.some((entry) => entry._id === incomingMessage._id)) {
          return previousMessages;
        }

        return [...previousMessages, incomingMessage];
      });
    });

    socket.on('discussion_room_users_updated', ({ roomId, users }) => {
      if (roomId !== joinedRoomIdRef.current) {
        return;
      }

      setOnlineUsers(Array.isArray(users) ? users : []);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const persistRoomPreferences = (nextRoomId, nextDisplayName) => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        roomId: nextRoomId,
        displayName: nextDisplayName,
      })
    );
  };

  const joinRoomWithSocket = (roomId, senderName) =>
    new Promise((resolve, reject) => {
      const socket = socketRef.current;

      if (!socket) {
        reject(new Error('Discussion socket is not ready yet.'));
        return;
      }

      socket.emit(
        'join_discussion_room',
        {
          roomId,
          senderName,
          userId,
        },
        (response) => {
          if (!response?.success) {
            reject(new Error(response?.message || 'Unable to join room.'));
            return;
          }

          resolve(response);
        }
      );
    });

  const leaveCurrentRoom = () => {
    const socket = socketRef.current;

    if (!socket || !joinedRoomIdRef.current) {
      return;
    }

    socket.emit('leave_discussion_room', {});
  };

  const handleJoinRoom = async (event) => {
    event?.preventDefault();

    const normalizedRoomId = normalizeRoomId(roomIdInput);
    const trimmedDisplayName = displayName.trim();

    if (!normalizedRoomId) {
      setError('Please enter a valid room name.');
      return;
    }

    if (!trimmedDisplayName) {
      setError('Please enter your name before joining.');
      return;
    }

    try {
      setIsJoining(true);
      setIsLoadingMessages(true);
      setError('');

      if (joinedRoomIdRef.current && joinedRoomIdRef.current !== normalizedRoomId) {
        leaveCurrentRoom();
      }

      const joinResponse = await joinRoomWithSocket(normalizedRoomId, trimmedDisplayName);
      const historyResponse = await discussionApi.getMessages(normalizedRoomId);
      const historyMessages = historyResponse.data?.messages || [];

      setJoinedRoomId(normalizedRoomId);
      setMessages((previousMessages) => {
        const mergedMessages = [...historyMessages, ...previousMessages.filter((entry) => entry.roomId === normalizedRoomId)];
        const uniqueMessages = [];
        const seenIds = new Set();

        for (const entry of mergedMessages) {
          if (!entry?._id || seenIds.has(entry._id)) {
            continue;
          }

          seenIds.add(entry._id);
          uniqueMessages.push(entry);
        }

        return uniqueMessages;
      });
      setOnlineUsers(joinResponse.users || []);
      setRoomIdInput(normalizedRoomId);
      persistRoomPreferences(normalizedRoomId, trimmedDisplayName);
    } catch (joinError) {
      setError(joinError.message || 'Unable to join the discussion room.');
    } finally {
      setIsJoining(false);
      setIsLoadingMessages(false);
    }
  };

  const handleLeaveRoom = () => {
    leaveCurrentRoom();
    setJoinedRoomId('');
    setMessages([]);
    setOnlineUsers([]);
    setMessageText('');
    setError('');
  };

  const handleSendMessage = async () => {
    const trimmedMessage = messageText.trim();
    const trimmedDisplayName = displayName.trim();

    if (!joinedRoomId || !trimmedMessage || !trimmedDisplayName) {
      return;
    }

    try {
      setIsSending(true);
      setError('');

      await new Promise((resolve, reject) => {
        const socket = socketRef.current;

        if (!socket) {
          reject(new Error('Discussion socket is not ready yet.'));
          return;
        }

        socket.emit(
          'send_discussion_message',
          {
            roomId: joinedRoomId,
            senderName: trimmedDisplayName,
            userId,
            text: trimmedMessage,
          },
          (response) => {
            if (!response?.success) {
              reject(new Error(response?.message || 'Unable to send message.'));
              return;
            }

            resolve(response.message);
          }
        );
      });

      setMessageText('');
    } catch (sendError) {
      setError(sendError.message || 'Unable to send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        onClick={() => setActivePage('notes')}
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#c8b99a] transition-colors hover:text-[#fff8eb]"
      >
        <ArrowLeft size={16} />
        Back to Notes
      </button>

      <div className="mb-10">
        <div className="workspace-pill mb-4">
          <MessageCircle size={14} />
          Discussion Notes
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#fff8eb] sm:text-5xl">
          Discussion Room
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-[#c8b99a]">
          Join a room, chat live with readers, and keep your group discussion in sync.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#fff8eb]">Join Room</h2>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  isConnected
                    ? 'bg-[rgba(58,212,123,0.12)] text-[#9be6b7]'
                    : 'bg-[rgba(255,120,120,0.12)] text-[#ffb0b0]'
                }`}
              >
                {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                {isConnected ? 'Live' : 'Offline'}
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleJoinRoom}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#c8b99a]">Your Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[rgba(212,166,58,0.14)] bg-[rgba(15,26,46,0.96)] px-4 py-3 text-[#fff8eb] placeholder-[#8e8164] focus:border-[#f3d58a] focus:outline-none focus:ring-1 focus:ring-[#f3d58a]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#c8b99a]">Room Name</label>
                <input
                  type="text"
                  value={roomIdInput}
                  onChange={(event) => setRoomIdInput(event.target.value)}
                  placeholder="readtogether-general"
                  className="w-full rounded-xl border border-[rgba(212,166,58,0.14)] bg-[rgba(15,26,46,0.96)] px-4 py-3 text-[#fff8eb] placeholder-[#8e8164] focus:border-[#f3d58a] focus:outline-none focus:ring-1 focus:ring-[#f3d58a]"
                />
                <p className="mt-2 text-xs text-[#8e8164]">
                  Example: `book-club-room` or `chapter-5-chat`
                </p>
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f3d58a] px-4 py-3 font-semibold text-[#0a1120] transition-colors hover:bg-[#e6c675] disabled:opacity-50"
              >
                {isJoining ? <LoaderCircle size={18} className="animate-spin" /> : <Users size={18} />}
                {joinedRoomId ? 'Switch Room' : 'Join Room'}
              </button>
            </form>

            {joinedRoomId ? (
              <button
                type="button"
                onClick={handleLeaveRoom}
                className="mt-4 w-full rounded-xl border border-[rgba(212,166,58,0.16)] px-4 py-3 text-sm font-semibold text-[#fff8eb] transition-colors hover:bg-[rgba(15,26,46,0.96)]"
              >
                Leave Room
              </button>
            ) : null}

            {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
          </div>

          <div className="rounded-[1.8rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#f3d58a]" />
              <h3 className="text-lg font-bold text-[#fff8eb]">Online Users</h3>
            </div>

            {!joinedRoomId ? (
              <p className="text-sm text-[#8e8164]">Join a room to see active readers.</p>
            ) : onlineUsers.length === 0 ? (
              <p className="text-sm text-[#8e8164]">No active users in this room yet.</p>
            ) : (
              <div className="space-y-3">
                {onlineUsers.map((entry) => (
                  <div
                    key={entry.socketId}
                    className="flex items-center justify-between rounded-2xl border border-[rgba(212,166,58,0.1)] bg-[rgba(15,26,46,0.96)] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(243,213,138,0.14)] text-sm font-bold text-[#f3d58a]">
                        {getInitials(entry.senderName)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#fff8eb]">{entry.senderName}</p>
                        <p className="text-xs text-[#8e8164]">
                          {entry.userId && entry.userId === userId ? 'You' : 'Online now'}
                        </p>
                      </div>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#59d68a]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-h-[520px] flex-col overflow-hidden rounded-[2rem] border border-[rgba(212,166,58,0.14)] bg-[rgba(8,16,32,0.92)]">
          <div className="flex items-center justify-between border-b border-[rgba(212,166,58,0.1)] px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-[#fff8eb]">
                {joinedRoomId ? `Room: ${joinedRoomId}` : 'Discussion Chat'}
              </h2>
              <p className="mt-1 text-sm text-[#8e8164]">
                {joinedRoomId
                  ? `${onlineUsers.length} active user${onlineUsers.length === 1 ? '' : 's'} in this room`
                  : 'Join a room to start chatting in real time.'}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!joinedRoomId ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-md rounded-[1.8rem] border border-dashed border-[rgba(212,166,58,0.14)] bg-[rgba(15,26,46,0.52)] px-8 py-10 text-center">
                  <MessageCircle size={32} className="mx-auto mb-4 text-[#f3d58a]" />
                  <h3 className="text-xl font-bold text-[#fff8eb]">Ready for live discussion</h3>
                  <p className="mt-3 text-sm leading-7 text-[#c8b99a]">
                    Enter your name and a room name on the left, then join to load past messages and chat instantly.
                  </p>
                </div>
              </div>
            ) : isLoadingMessages ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex items-center gap-3 rounded-2xl border border-[rgba(212,166,58,0.14)] bg-[rgba(15,26,46,0.96)] px-5 py-4 text-sm text-[#fff8eb]">
                  <LoaderCircle className="animate-spin text-[#f3d58a]" size={18} />
                  Loading previous messages...
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-md rounded-[1.8rem] border border-dashed border-[rgba(212,166,58,0.14)] bg-[rgba(15,26,46,0.52)] px-8 py-10 text-center">
                  <h3 className="text-xl font-bold text-[#fff8eb]">No messages yet</h3>
                  <p className="mt-3 text-sm leading-7 text-[#c8b99a]">
                    This room is empty right now. Send the first message to start the group discussion.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((entry) => {
                  const isOwnMessage =
                    (userId && entry.senderUserId === userId) ||
                    (!userId && entry.senderName === displayName.trim());

                  return (
                    <div
                      key={entry._id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-[1.5rem] border px-4 py-3 ${
                          isOwnMessage
                            ? 'border-[#f3d58a] bg-[rgba(243,213,138,0.16)] text-[#fff8eb]'
                            : 'border-[rgba(212,166,58,0.12)] bg-[rgba(15,26,46,0.96)] text-[#fff8eb]'
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2 text-xs text-[#c8b99a]">
                          <span className="font-bold text-[#f3d58a]">{entry.senderName}</span>
                          <span>{formatMessageTime(entry.createdAt)}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-7">{entry.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-[rgba(212,166,58,0.1)] p-4">
            <div className="flex items-center gap-3 rounded-[1.6rem] border border-[rgba(212,166,58,0.12)] bg-[rgba(15,26,46,0.96)] px-4 py-3">
              <input
                type="text"
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void handleSendMessage();
                  }
                }}
                disabled={!joinedRoomId || isSending}
                placeholder={joinedRoomId ? 'Type your message...' : 'Join a room to start chatting'}
                className="flex-1 bg-transparent py-2 text-sm text-[#fff8eb] placeholder:text-[#8e8164] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void handleSendMessage()}
                disabled={!joinedRoomId || !messageText.trim() || isSending}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3d58a] text-[#0a1120] transition-colors hover:bg-[#e6c675] disabled:opacity-50"
              >
                {isSending ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiscussionRoomPage;
