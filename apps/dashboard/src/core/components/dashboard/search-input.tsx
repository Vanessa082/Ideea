"use client";

import { Input } from "../ui/input";
import { Search } from "lucide-react";

export const SearchInput = () => {

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full pl-9"
        placeholder="Search boards"
      />
    </div>
  );
};
