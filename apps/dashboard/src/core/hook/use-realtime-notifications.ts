import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { BoardRole } from '../types/board.types';

const REALTIME_URL = process.env.NEXT_PUBLIC_REALTIME_URL;
let socket: Socket | null = null;

interface PersonalNotification {
  type: 'ACCESS_RESPONSE' | 'NEW_INVITE' | 'ACCESS_REQUEST';
  message: string;
  boardId: string;
  status?: 'approved' | 'denied';
  token?: string;
  requesterEmail?: string;
  requestedRole?: BoardRole;
}

export const useRealtimeNotifications = () => {
  const { accessToken, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 1. Exit if the client is not in a state to connect
    if (!isAuthenticated || !accessToken || !REALTIME_URL) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    // 2. Connect to the 'user' namespace
    socket = io(`${REALTIME_URL}/user`, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Realtime User Socket Connected');
    });

    socket.on('disconnect', () => {
      console.log('Realtime User Socket Disconnected');
    });

    // 3. Handler for personal notifications
    socket.on('personalNotification', (data: PersonalNotification) => {
      if (data.type === 'ACCESS_RESPONSE') {
        const toastFn = data.status === 'approved' ? toast.success : toast.error;
        toastFn(data.message, {
          action: {
            label: 'View Board',
            onClick: () => router.push(`/board/${data.boardId}`)
          }
        });
      } else if (data.type === 'NEW_INVITE' && data.token) {
        toast.info(data.message, {
          action: {
            label: 'Accept Invite',
            onClick: () => router.push(`/board/${data.boardId}/accept?token=${data.token}`)
          }
        });
      } else if (data.type === 'ACCESS_REQUEST') {
        // Notifies the owner about a new request
        toast.warning(data.message, {
          action: {
            label: 'Review',
            // Redirects to board page, which triggers the 'manage-sharing' action in /board/[id]/page.tsx
            onClick: () => router.push(`/board/${data.boardId}?action=manage-sharing`)
          }
        });
      }
    });

    // 4. Cleanup on unmount/re-run
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [isAuthenticated, accessToken, router]);
};