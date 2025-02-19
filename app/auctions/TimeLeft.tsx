'use client';

import React, { useEffect, useState } from 'react';

interface TimeLeftProps {
  endDate: Date;
}

export default function TimeLeft({ endDate }: TimeLeftProps) {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const timeLeft = new Date(endDate).getTime() - new Date().getTime();
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setTimeString(days > 0 ? `${days}d ${hours}h left` : `${hours}h left`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [endDate]);

  return <span>{timeString}</span>;
} 