"use client";

import { create } from "zustand";
import { Layer, Circle, Text } from "react-konva";
import { UserPresence as UserPresenceType } from "../../../types/board.types";

// Define the store to hold user presence state
interface UserPresenceState {
  users: Record<string, UserPresenceType>;
  addOrUpdateUser: (user: UserPresenceType) => void;
  removeUser: (id: string) => void;
}

export const useUserPresenceStore = create<UserPresenceState>((set) => ({
  users: {},
  addOrUpdateUser: (user) => {
    set((state) => ({
      users: { ...state.users, [user.id]: user },
    }));
  },
  removeUser: (id) => {
    set((state) => {
      const newUsers = { ...state.users };
      delete newUsers[id];
      return { users: newUsers };
    });
  },
}));

export const UserPresence = () => {
  const { users } = useUserPresenceStore();

  return (
    <Layer>
      {Object.values(users).map((user) => (
        <>
          <Circle
            key={user.id + '-cursor'}
            x={user.x}
            y={user.y}
            radius={5}
            fill={user.color}
          />
          <Text
            key={user.id + '-name'}
            x={user.x + 10} // Offset the text to the right
            y={user.y - 15} // Offset the text slightly above
            text={user.name}
            fontSize={12}
            fill={user.color}
            fontFamily="Arial"
          />
        </>
      ))}
    </Layer>
  );
};