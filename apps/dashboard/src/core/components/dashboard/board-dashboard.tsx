"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/core/hook/auth-context';
import { UserBoard } from '@/core/types/board.types'; // Assuming this interface exists
import { BoardCreationSection } from './sidebar/create-board';
import { Grid, List, SortAsc, SortDesc, Search } from 'lucide-react';
import BoardCard from './board-card'; // New component for single board display
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';


type ViewMode = 'grid' | 'list';
type SortBy = 'title' | 'createdAt' | 'updatedAt';
type Filter = 'owned-by-anyone' | 'owned-by-me' | 'not-owned-by-me';

const BoardDashboard = () => {
  const { accessToken, user } = useAuth();
  const [boards, setBoards] = useState<UserBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<Filter>('owned-by-anyone');

  const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

  // --- Data Fetching ---
  useEffect(() => {
    if (!accessToken) return;

    const fetchBoards = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${GATEWAY_URL}/board/boards`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch boards');

        let fetchedBoards: UserBoard[] = await res.json();

        // Enhance boards with client-side ownership check
        fetchedBoards = fetchedBoards.map(board => ({
          ...board,
          isOwner: board.ownerId === user?.id,
        }));

        setBoards(fetchedBoards);
      } catch (error) {
        console.error('Error fetching boards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, [accessToken, user?.id, GATEWAY_URL]);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedBoards = useMemo(() => {
    let filtered = boards.filter(board =>
      board.title.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === 'owned-by-me') {
      filtered = filtered.filter(board => board.isOwner);
    } else if (filter === 'not-owned-by-me') {
      filtered = filtered.filter(board => !board.isOwner);
    }

    // Convert to Date or string based on sortBy, and sort
    return filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (sortBy === 'title') {
        const comparison = aVal.localeCompare(bVal);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else { // createdAt or updatedAt (Date strings)
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        const comparison = aTime - bTime;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
  }, [boards, search, filter, sortBy, sortOrder]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        loading...
      </div>
    );
  }

  return (
    <div className="p-5 md:p-10">

      <section className="mb-8 pb-6 border-b border-border dark:border-border/60">
        <BoardCreationSection />
      </section>

      {/* 2. Controls (Filter, Sort, View) - Matching Google Docs Bar */}
      <section className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold flex-shrink-0">Recent boards</h2>

        <div className="flex items-center gap-4 flex-wrap">

          {/* Search Input */}
          <div className="relative w-full md:w-auto md:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your boards"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdown (Owned by me) */}
          <Select value={filter} onValueChange={(v: Filter) => setFilter(v)}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Owned by anyone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned-by-anyone">Owned by anyone</SelectItem>
              <SelectItem value="owned-by-me">Owned by me</SelectItem>
              <SelectItem value="not-owned-by-me">Not owned by me</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Dropdown (Name/Date) */}
          <Select value={sortBy} onValueChange={(v: SortBy) => setSortBy(v)}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="updatedAt">Last Modified</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order Button (Asc/Desc) */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="h-9 w-9"
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </Button>

          {/* View Mode Toggle */}
          <ToggleGroup type="single" value={viewMode} onValueChange={(v: ViewMode) => v && setViewMode(v)} className='h-9'>
            <ToggleGroupItem value="list" aria-label="List view" className='h-9 w-9'>
              <List size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view" className='h-9 w-9'>
              <Grid size={18} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </section>

      {/* 3. Board List */}
      <section>
        {filteredAndSortedBoards.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">
            {search ? `No boards found matching "${search}".` : "You haven't created or been invited to any boards yet."}
          </p>
        ) : (
          <div
            className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "flex flex-col gap-2"
            }
          >
            {filteredAndSortedBoards.map(board => (
              // The BoardCard component should handle the visual representation for both list and grid
              <BoardCard
                key={board._id}
                board={board}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BoardDashboard;