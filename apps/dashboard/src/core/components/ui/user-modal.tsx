"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../../../context/authContext";

interface UserModalProps {
  onClose: () => void;
}

const getInitials = (username: string) => {
  if (!username) return "";
  const parts = username.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return username[0].toUpperCase();
};

export const UserModal = ({ onClose }: UserModalProps) => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div
      className="absolute top-16 right-6 w-64 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 transform scale-100 opacity-100"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 dark:bg-blue-600 text-white font-bold text-lg">
          {getInitials(user.username)}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-x-2"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default UserModal;
