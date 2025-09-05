"use client";

import Image from "next/image";

import { cn } from "../../../../lib/utils";
import { Hint } from "../hint";

interface ItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

export const Item = ({ id, name, imageUrl }: ItemProps) => {
  return (
    <div className="aspect-square relative">
      <Hint label={name} side="right" align="start" sideOffset={18}>
        <Image
          fill
          src={imageUrl}
          alt={name}
          className={cn(
            "rounded-md cursor-pointer opacity-60 hover:opacity-100 transition",
          )}
        />
      </Hint>
    </div>
  );
};
