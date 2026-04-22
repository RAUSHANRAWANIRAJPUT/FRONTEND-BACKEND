import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Users, Clock, TrendingUp, ChevronRight, Sparkles, RefreshCcw } from 'lucide-react';
import { apiClient } from '../lib/api';

const Dashboard = ({ setActivePage, setUserData }) => {
  const [aiSuggestion, setAiSuggestion] = useState({
    title: "Project Hail Mary",
    author: "Andy Weir",
    reason: "Based on your interest in Molecular Biology and Sci-Fi, you might enjoy this thrilling journey."
  });
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  useEffect(() => {
    fetchAiSuggestion();
  }, []);

  const fetchAiSuggestion = async () => {
    setIsLoadingSuggestion(true);
    try {
      // Pass user interests if available in the dashboard context
      const interests = ['Sci-Fi', 'Molecular Biology']; // Default or from user data
      const response = await apiClient.get('/ai/suggestions', { params: { interests } });
      setAiSuggestion(response.data);
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };
  const currentBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      progress: 65,
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200",
      lastRead: "2 hours ago"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      progress: 42,
      cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=200",
      lastRead: "Yesterday"
    }
  ];

  const joinedClubs = [
    {
      id: 1,
      name: "Sci-Fi Seekers",
      members: 124,
      currentBook: "Dune",
      nextMeeting: "Tomorrow, 7 PM"
    },
    {
      id: 2,
      name: "Philosophy & Tea",
      members: 86,
      currentBook: "Meditations",
      nextMeeting: "Friday, 6 PM"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Surya! 👋</h1>
          <p className="text-gray-500">You've read 124 pages this week. Keep it up!</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Clock size={16} className="mr-2" /> History
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100">
            <TrendingUp size={16} className="mr-2" /> Stats
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Books */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Currently Reading</h2>
              <button className="text-primary-600 text-sm font-semibold hover:underline flex items-center">
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentBooks.map((book) => (
                <motion.div 
                  key={book.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex space-x-4 cursor-pointer"
                  onClick={() => setActivePage('book-details')}
                >
                  <img src={book.cover} alt={book.title} className="w-24 h-32 object-cover rounded-lg shadow-md" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-snug mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-primary-600">{book.progress}%</span>
                        <span className="text-[10px] text-gray-400">Last read {book.lastRead}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${book.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Joined Clubs */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Book Clubs</h2>
              <button className="text-primary-600 text-sm font-semibold hover:underline flex items-center">
                Discover More <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {joinedClubs.map((club) => (
                <div 
                  key={club.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:border-primary-100 transition-colors cursor-pointer"
                  onClick={() => setActivePage('club-details')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{club.name}</h3>
                      <p className="text-sm text-gray-500">Currently reading: <span className="text-gray-900 font-medium">{club.currentBook}</span></p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400 mb-1">Next Meeting</p>
                    <p className="text-sm font-semibold text-gray-700">{club.nextMeeting}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / AI Features */}
        <div className="space-y-8">
          <section className="rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-600 p-6 text-white shadow-xl shadow-primary-100">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles size={24} className="mr-2" />
                <h2 className="text-xl font-bold">AI Suggestions</h2>
              </div>
              <button 
                onClick={fetchAiSuggestion}
                disabled={isLoadingSuggestion}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
              >
                <RefreshCcw size={18} className={isLoadingSuggestion ? 'animate-spin' : ''} />
              </button>
            </div>

            {isLoadingSuggestion ? (
              <div className="mb-6 animate-pulse space-y-3">
                <div className="h-4 w-3/4 rounded bg-white/20"></div>
                <div className="h-20 rounded-2xl bg-white/10"></div>
              </div>
            ) : (
              <>
                <p className="mb-6 text-sm leading-relaxed text-primary-100">
                  {aiSuggestion.reason}
                </p>
                <div className="group mb-6 cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/20">
                   <h4 className="mb-1 text-sm font-bold">{aiSuggestion.title}</h4>
                   <p className="text-xs text-primary-100">By {aiSuggestion.author}</p>
                </div>
              </>
            )}
            
            <button 
              onClick={() => setActivePage('ai')}
              className="w-full rounded-xl bg-white py-3 text-sm font-bold text-primary-600 transition-colors hover:bg-primary-50"
            >
              Explore All Recommendations
            </button>
          </section>

          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Reading Progress</h2>
            <div className="flex items-end justify-between h-32 space-x-2">
               {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center">
                   <div className="w-full bg-primary-50 rounded-t-md hover:bg-primary-100 transition-colors" style={{ height: `${h}%` }}></div>
                   <span className="text-[10px] text-gray-400 mt-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                 </div>
               ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
