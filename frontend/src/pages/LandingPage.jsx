import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, BarChart3, Sparkles, ArrowRight, BookMarked } from 'lucide-react';
import HeroImageSlider from '../components/HeroImageSlider';

const LandingPage = ({ setActivePage, user, onOpenAuth }) => {
  const heroSlides = [
    {
      id: 'hero-poetry',
      src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200',
      alt: 'Milk and Honey book on a table',
      caption: 'Cozy, modern reading moments that turn into shared conversations.',
    },
    {
      id: 'hero-coffee',
      src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200',
      alt: 'Open book and coffee in a warm reading space',
      caption: 'From recommendations to chapter chats, your reading life stays in sync.',
    },
    {
      id: 'hero-library',
      src: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=1200',
      alt: 'Stacked books in a calm library setting',
      caption: 'Discover books that match your taste and keep your club engaged.',
    },
  ];

  const features = [
    {
      icon: <Sparkles className="text-primary-400" />,
      title: "AI Recommendations",
      description: "Discover your next favorite read with our advanced AI book suggestion engine."
    },
    {
      icon: <Users className="text-[#d8b566]" />,
      title: "Group Discussions",
      description: "Join real-time interactive chats and structured debates for every chapter."
    },
    {
      icon: <BarChart3 className="text-[#f1cf82]" />,
      title: "Progress Tracking",
      description: "Visualize your reading journey with beautiful charts and habit tracking tools."
    }
  ];

  return (
    <div className="overflow-hidden" id="hero">
      {/* Hero Section */}
      <section className="section-glow relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(212,166,58,0.14),transparent_30%),linear-gradient(180deg,#0d1930_0%,#091426_55%,#060f1f_100%)] pt-24 pb-20 lg:pt-36 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="items-center lg:grid lg:grid-cols-2 lg:gap-14">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="chip mb-6 text-sm font-semibold text-primary-600">
                <BookMarked size={16} className="mr-2" />
                <span>Next-Gen Book Club Platform</span>
              </div>
              <h1 className="hero-heading mb-8 text-5xl font-bold text-[#fff8eb] lg:text-7xl">
                Read Together,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-primary-400 to-primary-600">
                  Grow Together
                </span>
              </h1>
              <p className="mb-10 max-w-xl text-xl leading-relaxed text-[#d8ccb0]">
                Experience the magic of collective reading. Join thousands of book lovers, discuss your favorite chapters, and track your progress in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => (user ? setActivePage('dashboard') : onOpenAuth('signup'))}
                    className="btn-primary flex items-center justify-center"
                >
                  {user ? 'Open Dashboard' : 'Get Started'} <ArrowRight size={18} className="ml-2" />
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
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 shadow-[0_8px_16px_rgba(0,0,0,0.18)]">
                        <img 
                            src={`https://i.pravatar.cc/100?img=${i+10}`} 
                            alt="User" 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-[#c6b892]">Joined by 10,000+ readers</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mt-16 lg:mt-0 relative"
            >
              <div className="relative z-10 p-2 sm:p-4">
                <HeroImageSlider images={heroSlides} interval={4000} />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-primary-300 mix-blend-screen filter blur-3xl opacity-25 animate-blob"></div>
              <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-64 w-64 rounded-full bg-secondary-400 mix-blend-screen filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#07101f] relative overflow-hidden border-y border-[rgba(212,166,58,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-[#fff8eb] mb-8 lg:text-4xl">About ReadTogether</h2>
              <div className="space-y-6">
                <p className="text-lg text-[#c6b892] leading-relaxed">
                  ReadTogether is a premium digital ecosystem designed for modern readers. We believe that books are bridges to new perspectives, and sharing that journey makes it even more powerful.
                </p>
                <p className="text-lg text-[#c6b892] leading-relaxed">
                  Our platform combines sophisticated AI-driven insights with real-time community interaction, creating a seamless space where your reading life and social life converge.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-[#f3d58a]">10,000+</span>
                  <span className="text-sm uppercase tracking-wider text-[#9d8f6e]">Active Readers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-[#f3d58a]">500+</span>
                  <span className="text-sm uppercase tracking-wider text-[#9d8f6e]">Global Clubs</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mt-16 lg:mt-0 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-[rgba(212,166,58,0.22)]">
                <img 
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modern library" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#07101f]/60 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary-500/20 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[linear-gradient(180deg,#0a1426_0%,#07101f_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4 text-3xl font-bold text-[#fff8eb] lg:text-4xl">Elevate Your Reading Experience</h2>
            <p className="max-w-2xl mx-auto text-[#c6b892]">Our toolkit is designed to make reading more social, organized, and insightful.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="feature-card"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(212,166,58,0.08)] ring-1 ring-[rgba(212,166,58,0.18)]">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#fff8eb]">{feature.title}</h3>
                <p className="leading-relaxed text-[#c6b892]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
