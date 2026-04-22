import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Globe, Monitor, ArrowLeft } from 'lucide-react';

const AuthPage = ({ setActivePage }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <button 
            onClick={() => setActivePage('landing')}
            className="flex items-center text-gray-400 hover:text-primary-600 mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? 'Enter your details to access your clubs.' : 'Start your collaborative reading journey today.'}
            </p>
          </div>

          <form className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <button 
                type="button" 
                onClick={() => setActivePage('dashboard')}
                className="w-full btn-primary py-4 shadow-primary-200"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <Globe size={20} className="mr-2 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Google</span>
            </button>
            <button className="flex items-center justify-center py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <Monitor size={20} className="mr-2 text-gray-900" />
              <span className="text-sm font-medium text-gray-600">GitHub</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden md:block w-1/2 bg-primary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-600/90"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center text-white">
            <motion.div 
              key={isLogin ? 'login-img' : 'signup-img'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20"
            >
              <img 
                src="https://images.unsplash.com/photo-1491843331069-311ba2481741?auto=format&fit=crop&q=80&w=400" 
                alt="Reading together"
                className="w-64 h-64 object-cover rounded-2xl"
              />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4">A community of readers awaits you.</h3>
            <p className="text-primary-100 leading-relaxed max-w-sm">
              "Reading is a conversation. All books talk. But a good book listens as well." — Mark Haddon
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-xl"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
