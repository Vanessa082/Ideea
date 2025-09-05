"use client";

import { Bell, Share2, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "../ui/button";
import { SearchInput } from "./search-input";

export const Navbar = ({ boardTitle }: { boardTitle?: string }) => {
    const { theme, setTheme } = useTheme();

    return (
        <nav className="h-16 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between bg-background">
            {/* Left side: Board title */}
            <div className="flex items-center gap-x-3">
                <h1 className="text-lg font-semibold text-foreground">
                    {boardTitle || "Dashboard"}
                </h1>
            </div>

            {/* Middle: Invite + Presence (future) */}

            {/* Collaborators avatars (placeholder) */}
            {/* <div className="flex -space-x-2">
                    <Image
                    src="https://i.pravatar.cc/30?img=1"
                    className="w-8 h-8 rounded-full border border-white" alt={""} />
                    <Image
                    src="https://i.pravatar.cc/30?img=2"
                    className="w-8 h-8 rounded-full border border-white" alt={""} />
                    </div> */}

            {/* Right side: Utilities */}
            <div className="flex items-center gap-x-3">
                <Button className="flex items-center gap-x-2 bg-secondary-foreground">
                    <Share2 size={16} />
                    Invite
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-gray-400 cursor-pointer" />
            </div>
        </nav>
    );
};

export default Navbar;
