import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, BarChart3, Sparkles, ArrowRight, BookMarked } from 'lucide-react';

const LandingPage = ({ setActivePage }) => {
  const features = [
    {
      icon: <Sparkles className="text-purple-500" />,
      title: "AI Recommendations",
      description: "Discover your next favorite read with our advanced AI book suggestion engine."
    },
    {
      icon: <Users className="text-blue-500" />,
      title: "Group Discussions",
      description: "Join real-time interactive chats and structured debates for every chapter."
    },
    {
      icon: <BarChart3 className="text-green-500" />,
      title: "Progress Tracking",
      description: "Visualize your reading journey with beautiful charts and habit tracking tools."
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-6">
                <BookMarked size={16} className="mr-2" />
                <span>Next-Gen Book Club Platform</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-8">
                Read Together,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                  Grow Together
                </span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl">
                Experience the magic of collective reading. Join thousands of book lovers, discuss your favorite chapters, and track your progress in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => setActivePage('auth')}
                    className="btn-primary flex items-center justify-center"
                >
                  Join ReadTogether <ArrowRight size={18} className="ml-2" />
                </button>
                <button 
                    onClick={() => setActivePage('clubs')}
                    className="btn-secondary flex items-center justify-center"
                >
                  Explore Clubs
                </button>
              </div>
              
              <div className="mt-12 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200">
                        <img 
                            src={`https://i.pravatar.cc/100?img=${i+10}`} 
                            alt="User" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 font-medium">Joined by 10,000+ readers</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-16 lg:mt-0 relative"
            >
              <div className="relative z-10 p-4">
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" 
                      alt="Modern Book Reading" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Elevate Your Reading Experience</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our toolkit is designed to make reading more social, organized, and insightful.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
