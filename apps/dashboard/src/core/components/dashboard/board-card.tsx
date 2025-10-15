import { UserBoard } from '@/core/types/board.types';
import { FileText, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface BoardCardProps {
  board: UserBoard;
  viewMode: 'grid' | 'list';
}

const CARD_WIDTH = 'w-[200px]';
const CARD_HEIGHT = 'h-[260px]';
const CARD_MD_WIDTH = 'md:w-[220px]';
const CARD_MD_HEIGHT = 'md:h-[280px]';


const BoardCard = ({ board, viewMode }: BoardCardProps) => {
  const boardLink = `/board/${board._id}`;

  if (viewMode === 'grid') {
    return (
      <div className="
                w-full 
                flex flex-col 
                border border-gray-300 dark:border-gray-700 
                rounded-lg 
                overflow-hidden 
                hover:shadow-lg 
                transition-shadow
            ">
        {/* Thumbnail Area */}
        <Link href={boardLink} className="
                    h-32 
                    bg-gray-100 dark:bg-gray-800 
                    flex items-center justify-center 
      
                    border-b border-gray-300 dark:border-gray-700
                    p-4
                ">
          <FileText size={40} />
        </Link>
        {/* Info Area */}
        <div className="p-3 flex items-start justify-between">
          <div className="flex flex-col overflow-hidden">
            <Link href={boardLink}>
              <span className="font-medium text-sm truncate block hover:underline" title={board.title}>
                {board.title}
              </span>
            </Link>
            <span className="text-xs text-muted-foreground mt-0.5">
              Last modified: {new Date(board.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <BoardActionsDropdown board={board} />
        </div>
      </div>
    );
  }

  return (
    <div className="
            flex items-center justify-between 
            w-full 
            p-3 
            bg-red-600
            border-b border-gray-200 dark:border-gray-800 
            hover:bg-gray-50 dark:hover:bg-gray-800 
            transition-colors
        ">
      <Link href={boardLink} className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-4">
          <FileText size={18} className="flex-shrink-0" />
          <span className="font-medium text-sm truncate">{board.title}</span>
        </div>
      </Link>
      <div className="flex items-center text-xs text-muted-foreground w-[100px] justify-between flex-shrink-0">
        <span className="w-[150px] truncate">{board.isOwner ? 'Me' : board.ownerEmail}</span>
        <span className="w-[150px] truncate">{new Date(board.updatedAt).toLocaleDateString()}</span>
        <BoardActionsDropdown board={board} />
      </div>
    </div>
  );
};

const BoardActionsDropdown = ({ board }: { board: UserBoard }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="w-6 h-6">
        <MoreVertical size={16} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <Link href={`/board/${board._id}`}>Open</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>Share</DropdownMenuItem>
      {board.isOwner && <DropdownMenuItem>Delete</DropdownMenuItem>}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default BoardCard;