"use client";

import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Hand } from 'lucide-react';
import { Button } from '../../ui/button';
import { CommentsPanel } from '../board/comments';

export const CollaborativeDomySection = () => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [panelVisible, setPanelVisible] = useState(false);

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
  };

  const togglePanel = () => {
    setPanelVisible(!panelVisible);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg flex gap-2 z-50">
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
        <Button variant="ghost" size="icon" onClick={togglePanel}>
          <Hand size={20} />
        </Button>
      </div>

      {panelVisible && (
        <div className="fixed bottom-20 right-4 z-50">
          <CommentsPanel />
        </div>
      )}
    </>
  );
};

export default CollaborativeDomySection;
