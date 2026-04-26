import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Globe, Monitor, ArrowLeft } from 'lucide-react';
import heroImage from '../assets/hero.png';

const authSlides = [
  {
    id: 'reading-desk',
    src: heroImage,
    alt: 'Reading together',
    caption: 'Discover a calmer way to read, reflect, and stay in sync.',
  },
  {
    id: 'open-book',
    src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=900',
    alt: 'Open book and coffee on a table',
    caption: 'Move from solo reading into richer shared conversations.',
  },
  {
    id: 'library-stack',
    src: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=900',
    alt: 'Stack of books in a warm reading space',
    caption: 'Track progress, discover ideas, and grow with your club.',
  },
];

const AuthPage = ({ setActivePage, onAuthSuccess, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setIsLogin(initialMode !== 'signup');
  }, [initialMode]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % authSlides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    onAuthSuccess({
      name: isLogin ? 'Reader' : 'New Reader',
      email: 'reader@readtogether.local',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(212,166,58,0.14),transparent_28%),linear-gradient(180deg,#0d1930_0%,#091426_55%,#060f1f_100%)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[rgba(212,166,58,0.16)] bg-[#fff8eb] shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:flex-row"
      >
        <div className="w-full p-8 md:w-1/2 lg:p-12">
          <button
            onClick={() => setActivePage('landing')}
            className="group mb-8 flex items-center text-[#8b7a58] transition-colors hover:text-primary-600"
          >
            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>

          <div className="mb-10">
            <h2
              className="mb-2 text-3xl font-bold"
              style={{ color: '#17233c' }}
            >
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p style={{ color: '#7f6f56' }}>
              {isLogin ? 'Enter your details to access your clubs.' : 'Start your collaborative reading journey today.'}
            </p>
          </div>

          <form className="space-y-6">
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#24314c]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7d60]" size={18} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-[#d9ccb5] bg-[#fffdf8] py-3 pl-10 pr-4 text-[#17233c] placeholder:text-[#b3a487] transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#24314c]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7d60]" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#d9ccb5] bg-[#fffdf8] py-3 pl-10 pr-4 text-[#17233c] placeholder:text-[#b3a487] transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#24314c]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7d60]" size={18} />
                <input
                  type="password"
                  placeholder="********"
                  className="w-full rounded-xl border border-[#d9ccb5] bg-[#fffdf8] py-3 pl-10 pr-4 text-[#17233c] placeholder:text-[#b3a487] transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full btn-primary py-4"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#eadfcb]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#fff8eb] px-2 text-[#9a8b70]">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center rounded-xl border border-[#e3d7c2] py-3 text-[#24314c] transition-colors hover:bg-[#fff3da]">
              <Globe size={20} className="mr-2 text-red-500" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center rounded-xl border border-[#e3d7c2] py-3 text-[#24314c] transition-colors hover:bg-[#fff3da]">
              <Monitor size={20} className="mr-2 text-[#24314c]" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[#9a8b70]">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-primary-600 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        <div className="relative hidden w-1/2 overflow-hidden bg-secondary-900 md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-700"></div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center text-white">
            <div className="mb-8 w-full max-w-[18rem]">
              <div className="relative h-64 overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                {authSlides.map((slide, index) => {
                  const isActive = index === activeSlide;

                  return (
                    <img
                      key={slide.id}
                      src={slide.src}
                      alt={slide.alt}
                      loading={isActive ? 'eager' : 'lazy'}
                      onError={(event) => {
                        if (event.currentTarget.src !== heroImage) {
                          event.currentTarget.src = heroImage;
                        }
                      }}
                      className={`absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-2xl object-cover transition-all duration-700 ${
                        isActive ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {authSlides.map((slide, index) => (
                  <button
                    key={`${slide.id}-dot`}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show auth slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeSlide ? 'w-8 bg-[#efc45d]' : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            <h3 className="mb-4 text-2xl font-bold">A community of readers awaits you.</h3>
            <p className="max-w-sm text-[#f6e7bf]">
              {authSlides[activeSlide]?.caption}
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-primary-300/25 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-32 w-32 rounded-full bg-primary-200/15 blur-xl"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
