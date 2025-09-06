"use client";

import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Hand } from 'lucide-react';
import { Button } from '../../ui/button';

export const CollaborativeDomySection = () => {
  const [micEnabled, setMicEnabled] = useState(true);

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMic}
        className={micEnabled ? 'text-green-500' : 'text-red-500'}
      >
        {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </Button>
      <Button variant="ghost" size="icon">
        <Volume2 size={20} />
      </Button>
      <Button variant="ghost" size="icon">
        <Hand size={20} />
      </Button>
    </div>
  );
};

export default CollaborativeDomySection;
