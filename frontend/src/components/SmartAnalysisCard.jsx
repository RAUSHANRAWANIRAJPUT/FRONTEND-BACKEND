import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, LoaderCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { recalibrateRecommendationModel } from '../lib/ai';

const SmartAnalysisCard = ({ onRecommendationsUpdated, userId }) => {
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  const handleRecalibrate = async () => {
    if (isRecalibrating) {
      return;
    }

    setIsRecalibrating(true);

    try {
      const payload = await recalibrateRecommendationModel(userId);
      onRecommendationsUpdated?.(payload.recommendations, payload.analytics);
      toast.success('Model recalibrated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to recalibrate the model right now.');
    } finally {
      setIsRecalibrating(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[rgba(166,186,220,0.16)] bg-[linear-gradient(180deg,rgba(12,22,42,0.98),rgba(7,14,28,0.98))] p-8 text-white shadow-[0_22px_50px_rgba(0,0,0,0.28)]">
      <BrainCircuit size={32} className="mb-4 text-[#a9c2ff]" />
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#a9c2ff]">Recommendation Model</p>
      <h3 className="mb-2 text-xl font-semibold text-[#f8fbff]">Smart analysis</h3>
      <p className="mb-6 text-sm leading-relaxed text-[#9aabc8]">
        The workspace weighs reading speed, saved highlights, discussion signals, and recent themes before refreshing your matches.
      </p>

      <motion.button
        type="button"
        onClick={handleRecalibrate}
        disabled={isRecalibrating}
        whileTap={isRecalibrating ? undefined : { scale: 0.97 }}
        whileHover={isRecalibrating ? undefined : { y: -1 }}
        className="flex w-full items-center justify-center rounded-2xl border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] py-3 text-sm font-semibold text-[#e5ecfb] transition-all hover:border-[rgba(111,144,255,0.32)] hover:bg-[rgba(12,22,42,0.95)] disabled:cursor-not-allowed disabled:opacity-80"
      >
        {isRecalibrating ? (
          <>
            <LoaderCircle size={16} className="mr-2 animate-spin" />
            Recalibrating...
          </>
        ) : (
          <>
            <RefreshCw size={16} className="mr-2" />
            Recalibrate Model
          </>
        )}
      </motion.button>
    </div>
  );
};

export default SmartAnalysisCard;
