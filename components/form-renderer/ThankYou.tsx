'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import type { FormSettings } from '@/types';

interface ThankYouProps {
  settings: FormSettings;
}

/**
 * Thank You Screen
 *
 * Displayed after successful form submission
 */
export const ThankYou: React.FC<ThankYouProps> = ({ settings }) => {
  useEffect(() => {
    // Redirect if URL is provided
    if (settings.redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = settings.redirectUrl!;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [settings.redirectUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Success Icon */}
        <motion.div
          className="mb-8 inline-block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <motion.svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {settings.showThankYouMessage !== false && settings.thankYouMessage
            ? 'Thank You!'
            : 'Response Submitted!'}
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {settings.thankYouMessage || 'Your response has been recorded.'}
        </motion.p>

        {settings.redirectUrl && (
          <motion.p
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Redirecting in 3 seconds...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
