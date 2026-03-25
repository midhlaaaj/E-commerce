'use client';

import { useEffect } from 'react';

interface VisitTrackerProps {
  productId: string;
}

export const VisitTracker = ({ productId }: VisitTrackerProps) => {
  useEffect(() => {
    if (!productId) return;

    try {
      const historyJson = localStorage.getItem('recently-visited');
      let history: string[] = historyJson ? JSON.parse(historyJson) : [];

      // Remove if already exists to move to front
      history = history.filter(id => id !== productId);
      
      // Add to front
      history.unshift(productId);

      // Limit to 10 items
      const limitedHistory = history.slice(0, 10);

      localStorage.setItem('recently-visited', JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error tracking visit:', error);
    }
  }, [productId]);

  return null; // This component doesn't render anything
};
