import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Image from "next/image";
import {
  Plus,
  Calendar,
  User,
  Grid,
  Edit3,
  Trash2,
  Copy,
  FolderOpen,
  Search,
  Loader2,
  Download
} from 'lucide-react';
import { useBoardStore } from '../../../../store/board-store';
import { useAuth } from '../../../../context/authContext';
import { NewBoardModal } from './board/new-board-modal';
import { CanvasElement } from '../../types/board.types';

interface Board {
  _id: string;
  roomId: string;
  name: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  elements: any[];
}

export const EmptyOrg = () => {
  const { user } = useAuth();
  const {
    boards,
    currentBoard,
    isLoading,
    loadUserBoards,
    loadBoard,
    createNewBoard,
    deleteBoardById,
    duplicateBoardById
  } = useBoardStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);

  useEffect(() => {
    loadUserBoards();
  }, [loadUserBoards]);

  const filteredBoards = boards.filter((board: Board) =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.roomId.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleDeleteBoard = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      await deleteBoardById(roomId);
    }
  };

  const handleDuplicateBoard = async (roomId: string, originalName: string) => {
    const newName = `${originalName} (Copy)`;
    await duplicateBoardById(roomId, newName);
  };

  const handleDownloadBoard = (board: Board) => {
    const boardData = {
      ...board,
      downloadedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(boardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${board.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_board.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show empty state when no boards exist
  if (!isLoading && boards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Image src="/elements.svg" alt="Empty" height={300} width={300} />
        <h2 className="text-2xl font-semibold mt-6">Welcome to <span className='text-yellow-300'>Ideea</span></h2>
        <p className="text-muted-foreground text-sm mt-2 text-center max-w-md">
          Create your first canvas board to start drawing, sketching, and collaborating
        </p>
        <div className="mt-6">
          <button
            onClick={() => setShowNewBoardModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Board</span>
          </button>
        </div>
      </div>
    );
  }

  // Show boards when they exist
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Welcome to  <span className='text-yellow-300'>Ideea</span></h2>
            <p className="text-muted-foreground text-sm mt-1">
              {boards.length} board{boards.length !== 1 ? 's' : ''} created
            </p>
          </div>
          <button
            onClick={() => setShowNewBoardModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Board</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredBoards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FolderOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No boards found</h3>
            <p className="text-gray-500 text-center">
              {searchTerm ? 'Try adjusting your search criteria' : 'Your boards will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBoards.map((board: Board) => (
              <BoardCard
                key={board._id}
                board={board}
                isActive={currentBoard?.roomId === board.roomId}
                onOpen={() => loadBoard(board.roomId)}
                onDelete={() => handleDeleteBoard(board.roomId)}
                onDuplicate={() => handleDuplicateBoard(board.roomId, board.name)}
                onDownload={handleDownloadBoard}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Board Modal */}
      <NewBoardModal
        open={showNewBoardModal}
        onClose={() => setShowNewBoardModal(false)}
      />
    </div>
  );
};

const BoardPreview: React.FC<{ elements: CanvasElement[] }> = ({ elements }) => {
  if (!elements || elements.length === 0) {
    return <Grid className="w-8 h-8 text-gray-400" />;
  }

  // Calculate bounds of all elements
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  elements.forEach(element => {
    if (element.points) {
      for (let i = 0; i < element.points.length; i += 2) {
        minX = Math.min(minX, element.points[i]);
        maxX = Math.max(maxX, element.points[i]);
        minY = Math.min(minY, element.points[i + 1]);
        maxY = Math.max(maxY, element.points[i + 1]);
      }
    } else {
      minX = Math.min(minX, element.x);
      maxX = Math.max(maxX, element.x + (element.width || 0));
      minY = Math.min(minY, element.y);
      maxY = Math.max(maxY, element.y + (element.height || 0));
    }
  });

  const width = maxX - minX || 100;
  const height = maxY - minY || 100;
  const scale = Math.min(120 / width, 80 / height);

  const renderElement = (element: CanvasElement) => {
    const scaledX = (element.x - minX) * scale;
    const scaledY = (element.y - minY) * scale;
    const scaledWidth = (element.width || 0) * scale;
    const scaledHeight = (element.height || 0) * scale;

    switch (element.type) {
      case 'line':
        if (element.points && element.points.length >= 4) {
          let path = `M ${((element.points[0] - minX) * scale)} ${((element.points[1] - minY) * scale)}`;
          for (let i = 2; i < element.points.length; i += 2) {
            path += ` L ${((element.points[i] - minX) * scale)} ${((element.points[i + 1] - minY) * scale)}`;
          }
          return <path key={element.id} d={path} stroke={element.color} strokeWidth={element.strokeWidth || 2} fill="none" />;
        }
        return null;
      case 'rectangle':
        return <rect key={element.id} x={scaledX} y={scaledY} width={scaledWidth} height={scaledHeight} stroke={element.color} strokeWidth={element.strokeWidth || 2} fill="none" />;
      case 'circle':
        const radius = Math.min(scaledWidth, scaledHeight) / 2;
        return <circle key={element.id} cx={scaledX + radius} cy={scaledY + radius} r={radius} stroke={element.color} strokeWidth={element.strokeWidth || 2} fill="none" />;
      case 'text':
        return <text key={element.id} x={scaledX} y={scaledY + 12} fontSize="10" fill={element.color}>{element.text}</text>;
      default:
        return null;
    }
  };

  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="border border-gray-200 rounded">
      <rect width="120" height="80" fill="#f8fafc" />
      {elements.slice(0, 20).map(renderElement)}
    </svg>
  );
};

interface BoardCardProps {
  board: Board;
  isActive: boolean;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDownload: (board: Board) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  board,
  isActive,
  onOpen,
  onDelete,
  onDuplicate,
  onDownload
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className={`bg-white rounded-lg border p-4 hover:shadow-lg transition-all cursor-pointer relative group ${
        isActive ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      onClick={onOpen}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Board Preview */}
      <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
        <BoardPreview elements={board.elements || []} />
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-medium">
          {board.elements?.length || 0} elements
        </div>
      </div>

      {/* Board Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 truncate">{board.name}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center truncate">
            <User className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{board.roomId}</span>
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Updated {formatDate(board.updatedAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onDownload(board)}
            className="p-1.5 bg-white/90 hover:bg-white rounded-md shadow-sm hover:shadow-md transition-all"
            title="Download"
          >
            <Download className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1.5 bg-white/90 hover:bg-white rounded-md shadow-sm hover:shadow-md transition-all"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-white/90 hover:bg-white rounded-md shadow-sm hover:shadow-md transition-all text-red-600 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
};
