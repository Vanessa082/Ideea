"use client";
import React, { useState } from 'react';
import { Bell, XCircle } from 'lucide-react';
import { useNotifications } from '@/core/hook/notification-context';
import { Button } from '@/core/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';

export const NotificationIcon = () => {
  const { unreadCount, markAllAsRead, notifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Simple handler to view the notifications (for now, just marks them read)
  const handleOpen = () => {
    setIsOpen(true);
    if (unreadCount > 0) {
      // Option 1: Mark all as read when opening
      markAllAsRead();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpen}
          className="relative p-2"
          aria-label={`You have ${unreadCount} unread notifications`}
        >
          <Bell size={16} />
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full w-3 h-3 text-white">
              {/* Optional: Display count if needed */}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold text-sm">Notifications ({notifications.length})</h4>
          <PopoverClose asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <XCircle size={14} />
            </Button>
          </PopoverClose>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-sm p-4 text-muted-foreground">No new notifications.</p>
          ) : (
            // Implement proper list rendering here (e.g., clickable items)
            notifications.slice(0, 5).map(n => (
              <div key={n.id} className={`p-3 text-sm border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 ${n.isRead ? 'text-muted-foreground opacity-70' : 'font-medium'}`}>
                <p>{n.message}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {n.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};