import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, BookOpen, Share2, Heart, ChevronLeft, Sparkles, MessageSquare } from 'lucide-react';

const BookDetailsPage = ({ setActivePage }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button 
        onClick={() => setActivePage('dashboard')}
        className="flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors group"
      >
        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Book Cover & Quick Stats */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-24"
          >
            <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 mb-8 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" 
                alt="Book Cover" 
                className="w-full h-auto object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Rating</p>
                <div className="flex items-center justify-center text-yellow-500 font-bold text-lg">
                  <Star size={18} fill="currentColor" className="mr-1" /> 4.8
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Readers</p>
                <div className="text-gray-900 font-bold text-lg">12.4k</div>
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4">
               <button className="flex-1 flex items-center justify-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                  <Heart size={20} className="mr-2" /> Wishlist
               </button>
               <button className="flex-1 flex items-center justify-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                  <Share2 size={20} className="mr-2" /> Share
               </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Book Details & Actions */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center space-x-2 text-primary-600 font-semibold mb-4 text-sm">
                <span className="bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wide text-[10px]">Bestseller</span>
                <span className="bg-secondary-50 text-secondary-600 px-3 py-1 rounded-full uppercase tracking-wide text-[10px]">Fiction</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">The Midnight Library</h1>
            <p className="text-xl text-gray-500 mb-8">By <span className="text-gray-900 font-medium">Matt Haig</span></p>
            
            <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100 mb-8">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={20} className="mr-2 text-primary-500" />
                <span>10h 30m reading time</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen size={20} className="mr-2 text-primary-500" />
                <span>304 Pages</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MessageSquare size={20} className="mr-2 text-primary-500" />
                <span>850+ Discussion points</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-500 leading-loose mb-10">
              Between life and death there is a library, and within that library, the shelves go on forever. 
              Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... 
              Would you have done anything different, if you had the chance to undo your regrets?
            </p>

            <div className="bg-primary-50 border border-primary-100 rounded-3xl p-8 mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-primary-900 flex items-center">
                   <Clock size={20} className="mr-2" /> Current Progress
                </h3>
                <span className="text-primary-600 font-bold">198 of 304 pages</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3 mb-6">
                <div className="bg-primary-600 h-3 rounded-full shadow-lg shadow-primary-200" style={{ width: '65%' }}></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary py-4 px-10 flex-grow text-center">
                  Continue Reading
                </button>
                <button 
                    onClick={() => setActivePage('club-details')}
                    className="btn-secondary py-4 px-10 flex-grow text-center"
                >
                  Join Conversation
                </button>
              </div>
            </div>
            
            {/* AI Insights Card */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <div className="bg-sparkle-gradient p-2 rounded-full text-purple-600 bg-purple-50">
                        <Sparkles size={20} />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">AI Chapter Insights</h3>
                <p className="text-gray-500 italic text-sm mb-6 leading-relaxed">
                  "This book explores the quantum physics concept of the 'multiverse' through a philosophical lens of regret and satisfaction."
                </p>
                <div className="flex space-x-3">
                   <button className="text-sm font-bold text-primary-600 hover:text-primary-700">Get Summary</button>
                   <span className="text-gray-300">•</span>
                   <button className="text-sm font-bold text-primary-600 hover:text-primary-700">Ask Question</button>
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
