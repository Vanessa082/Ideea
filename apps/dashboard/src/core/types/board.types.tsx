
export type Vector2d = {
  x: number;
  y: number;
};

export type ElementType = 'line' | 'rectangle' | 'circle' | 'text' | 'arrow';

export interface CanvasElement {
  id: string;
  type: ElementType;
  points?: number[];
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  text?: string;
  strokeWidth?: number;
  isDragging?: boolean;
}

export interface BoardEvent {
  boardId: string;
  element: CanvasElement;
}

export type ToolType = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'brush' | 'arrow' | 'line' | 'fill';

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  boardId: string;
  x: number;
  y: number;
}

// @/core/types/board-schema.ts

export enum BoardRole {
  OWNER = "owner",
  EDITOR = "editor",
  COMMENTER = "commenter",
  VIEWER = "viewer",
}

export interface BoardMember {
  email: string;
  userId: string;
  role: BoardRole;
}


export interface Board {
  _id: string;
  title: string;
  isPublic: boolean;
  ownerId: string;
  members: BoardMember[];
  accessRequests: AccessRequest[];
}

export enum InviteStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  EXPIRED = "expired",
}

export interface BoardInvite {
  _id: string;
  email?: string;
  targetUserId?: string;
  role: BoardRole.EDITOR | BoardRole.VIEWER | BoardRole.COMMENTER;
  token: string;
  status: InviteStatus;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface PublicLink {
  token: string;
  role: Exclude<BoardRole, BoardRole.OWNER>;
}

export interface AccessRequest {
  _id: string; // Change to string for frontend, as MongoDB ObjectId is a string here
  userId: string;
  requesterEmail?: string;
  requestedRole: BoardRole.VIEWER | BoardRole.COMMENTER | BoardRole.EDITOR;
  message?: string;
  status: "pending" | "approved" | "denied";
  createdAt: string; // Use string for Date objects from backend
  updatedAt: string;
}

// Update the main Board interface to include accessRequests
export interface BoardDocument {
  _id: string; // Add _id since it's a top-level document
  title: string;
  slug: string;
  ownerId: string;
  ownerEmail: string;
  members: BoardMember[];
  invites: BoardInvite[];
  publicLink: PublicLink | null;
  accessRequests: AccessRequest[]; // Add this
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}