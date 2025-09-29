"use client";

import React, { useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/core/hook/auth-context";

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
  const router = useRouter();
  const { user, logout } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace("/");
    onClose();
  };

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="absolute top-16 right-6 w-64 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 transition-all duration-300"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--chart-2)] via-[var(--chart-3)] to-[var(--chart-1)] text-primary-foreground font-semibold shadow-sm">
          {getInitials(user.username)}
        </div>

        {/* User Info */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>

        {/* Logout Button */}
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
