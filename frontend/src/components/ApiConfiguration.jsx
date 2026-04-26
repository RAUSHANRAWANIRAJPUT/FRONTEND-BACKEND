import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, Save, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ApiConfiguration = ({ isOpen, onClose }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('api_base_url') || '';
      setApiUrl(saved);
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsSaving(true);
    try {
      if (apiUrl.trim()) {
        localStorage.setItem('api_base_url', apiUrl.trim());
        toast.success('API Base URL saved. Reloading...');
      } else {
        localStorage.removeItem('api_base_url');
        toast.success('Reset to default API URL. Reloading...');
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error('Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setApiUrl('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-[#1f3b26] bg-[#050c07] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary-600/10 blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-secondary-600/10 blur-[80px]" />

            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/20 text-primary-400">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#f0fdf4]">Network API Settings</h2>
                    <p className="text-sm text-[#86efac]">Configure your backend connection</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f3b26] bg-[#08110b] text-[#86efac] transition hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-[#08110b] border border-[#1f3b26] p-4">
                  <div className="flex items-start gap-3 text-xs text-[#d9f99d]">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <p>
                      Changing this will reload the application to apply new network settings. 
                      Ensure your backend is running at the specified address.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-[#dcfce7]">API Base URL</label>
                  <div className="group relative">
                    <input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder={`e.g. ${DEFAULT_API_URL}`}
                      className="w-full rounded-2xl border border-[#1f3b26] bg-[#08110b] px-5 py-4 text-sm text-[#f0fdf4] transition placeholder:text-[#2d3f34] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {apiUrl && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-primary-500" />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-[#4ade80]">
                    Current default: <code className="rounded bg-[#08110b] px-1 py-0.5 border border-[#16261b]">{DEFAULT_API_URL}</code>
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#1f3b26] bg-[#08110b] px-6 py-4 text-sm font-semibold text-[#d9f99d] transition hover:bg-[#0b1b10] hover:text-white"
                  >
                    <RotateCcw size={18} />
                    Reset to Default
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(34,197,94,0.3)] transition hover:bg-primary-500 hover:translate-y-[-2px] active:translate-y-[0] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <Save size={18} />
                    )}
                    Apply Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApiConfiguration;
