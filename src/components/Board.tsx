import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Star, MoreHorizontal, Moon, Sun, 
  Download, Upload, Activity, BarChart3, Users, Settings,
  Archive, Keyboard, Grid3X3
} from 'lucide-react';
import { Board as BoardType, Card as CardType, List as ListType, FilterOptions, BulkOperation } from '../types';
import { List } from './List';
import { CardModal } from './CardModal';
import { FilterPanel } from './FilterPanel';
import { BulkActions } from './BulkActions';
import { ActivityTimeline } from './ActivityTimeline';
import { BoardStats } from './BoardStats';
import { BoardSelector } from './BoardSelector';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useDarkMode } from '../hooks/useDarkMode';
import { predefinedLabels } from '../data/mockData';

interface BoardProps {
  board: BoardType;
  onUpdateBoard: (board: BoardType) => void;
  boards?: BoardType[];
  onSelectBoard?: (board: BoardType) => void;
  onCreateBoard?: () => void;
}

export const Board: React.FC<BoardProps> = ({ 
  board, 
  onUpdateBoard,
  boards = [board],
  onSelectBoard,
  onCreateBoard,
}) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    members: [],
    labels: [],
    dueDate: 'all',
    archived: false,
    priority: [],
    searchQuery: '',
  });

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const {
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
  } = useDragAndDrop();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewCard: () => {
      // Focus on first list's add card button
      const firstList = board.lists[0];
      if (firstList) {
        // This would need to be implemented with refs in a real app
        console.log('New card shortcut');
      }
    },
    onSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    onToggleDarkMode: toggleDarkMode,
    onBulkSelect: () => setBulkSelectMode(!bulkSelectMode),
  });

  // Update search query in filters when searchQuery changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, searchQuery }));
  }, [searchQuery]);

  const handleCardClick = (card: CardType) => {
    if (!bulkSelectMode) {
      setSelectedCard(card);
    }
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const handleUpdateCard = (cardId: string, updates: Partial<CardType>) => {
    const updatedBoard = { ...board };
    updatedBoard.lists = updatedBoard.lists.map(list => ({
      ...list,
      cards: list.cards.map(card =>
        card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
      ),
    }));
    
    // Add activity log
    updatedBoard.activityLog = [
      {
        id: Date.now().toString(),
        type: 'card_updated',
        description: `Updated card "${updatedBoard.lists.flatMap(l => l.cards).find(c => c.id === cardId)?.title}"`,
        user: 'Current User',
        timestamp: new Date(),
        cardId,
      },
      ...updatedBoard.activityLog,
    ];
    
    onUpdateBoard(updatedBoard);
    
    // Update selected card if it's the one being edited
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard({ ...selectedCard, ...updates });
    }
  };

  const handleAddCard = (listId: string, title: string) => {
    const list = board.lists.find(l => l.id === listId);
    if (!list) return;

    const newCard: CardType = {
      id: Date.now().toString(),
      title,
      description: '',
      labels: [],
      checklist: [],
      comments: [],
      members: [],
      listId,
      position: list.cards.length,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeEntries: [],
      dependencies: [],
      priority: 'medium',
    };

    const updatedBoard = { ...board };
    updatedBoard.lists = updatedBoard.lists.map(l =>
      l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l
    );
    
    // Add activity log
    updatedBoard.activityLog = [
      {
        id: Date.now().toString(),
        type: 'card_created',
        description: `Created card "${title}"`,
        user: 'Current User',
        timestamp: new Date(),
        cardId: newCard.id,
        listId,
      },
      ...updatedBoard.activityLog,
    ];
    
    onUpdateBoard(updatedBoard);
  };

  const handleCardDrop = (cardId: string, targetListId: string) => {
    const sourceList = board.lists.find(list => 
      list.cards.some(card => card.id === cardId)
    );
    const targetList = board.lists.find(list => list.id === targetListId);
    
    if (!sourceList || !targetList || sourceList.id === targetList.id) return;

    const cardToMove = sourceList.cards.find(card => card.id === cardId);
    if (!cardToMove) return;

    const updatedBoard = { ...board };
    
    // Remove card from source list
    updatedBoard.lists = updatedBoard.lists.map(list => {
      if (list.id === sourceList.id) {
        return { ...list, cards: list.cards.filter(card => card.id !== cardId) };
      }
      if (list.id === targetList.id) {
        return {
          ...list,
          cards: [...list.cards, { ...cardToMove, listId: targetList.id, updatedAt: new Date() }],
        };
      }
      return list;
    });

    // Add activity log
    updatedBoard.activityLog = [
      {
        id: Date.now().toString(),
        type: 'card_moved',
        description: `Moved "${cardToMove.title}" from ${sourceList.title} to ${targetList.title}`,
        user: 'Current User',
        timestamp: new Date(),
        cardId,
        listId: targetListId,
      },
      ...updatedBoard.activityLog,
    ];

    onUpdateBoard(updatedBoard);
  };

  const handleToggleCardSelect = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleBulkOperation = (operation: BulkOperation) => {
    const updatedBoard = { ...board };
    
    switch (operation.type) {
      case 'move':
        if (operation.targetListId) {
          updatedBoard.lists = updatedBoard.lists.map(list => {
            if (list.id === operation.targetListId) {
              const cardsToMove = board.lists
                .flatMap(l => l.cards)
                .filter(card => operation.cardIds.includes(card.id))
                .map(card => ({ ...card, listId: operation.targetListId!, updatedAt: new Date() }));
              return { ...list, cards: [...list.cards, ...cardsToMove] };
            }
            return { ...list, cards: list.cards.filter(card => !operation.cardIds.includes(card.id)) };
          });
        }
        break;
      case 'archive':
        updatedBoard.lists = updatedBoard.lists.map(list => ({
          ...list,
          cards: list.cards.map(card =>
            operation.cardIds.includes(card.id) 
              ? { ...card, archived: true, updatedAt: new Date() }
              : card
          ),
        }));
        break;
      case 'assign':
        if (operation.targetMember) {
          updatedBoard.lists = updatedBoard.lists.map(list => ({
            ...list,
            cards: list.cards.map(card =>
              operation.cardIds.includes(card.id)
                ? { 
                    ...card, 
                    members: card.members.some(m => m.id === operation.targetMember!.id)
                      ? card.members
                      : [...card.members, operation.targetMember!],
                    updatedAt: new Date()
                  }
                : card
            ),
          }));
        }
        break;
      case 'label':
        if (operation.targetLabel) {
          updatedBoard.lists = updatedBoard.lists.map(list => ({
            ...list,
            cards: list.cards.map(card =>
              operation.cardIds.includes(card.id)
                ? { 
                    ...card, 
                    labels: card.labels.some(l => l.id === operation.targetLabel!.id)
                      ? card.labels
                      : [...card.labels, operation.targetLabel!],
                    updatedAt: new Date()
                  }
                : card
            ),
          }));
        }
        break;
    }
    
    onUpdateBoard(updatedBoard);
    setSelectedCards([]);
    setBulkSelectMode(false);
  };

  const handleExportBoard = () => {
    const dataStr = JSON.stringify(board, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${board.title.replace(/\s+/g, '_')}_board.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportBoard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedBoard = JSON.parse(e.target?.result as string);
          onUpdateBoard(importedBoard);
        } catch (error) {
          alert('Error importing board: Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Filter cards based on current filters
  const filteredLists = board.lists.map(list => ({
    ...list,
    cards: list.cards.filter(card => {
      // Search query
      if (filters.searchQuery && !card.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !card.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Members filter
      if (filters.members.length > 0 && !card.members.some(member => filters.members.includes(member.id))) {
        return false;
      }
      
      // Labels filter
      if (filters.labels.length > 0 && !card.labels.some(label => filters.labels.includes(label.id))) {
        return false;
      }
      
      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(card.priority)) {
        return false;
      }
      
      // Due date filter
      if (filters.dueDate !== 'all') {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        switch (filters.dueDate) {
          case 'overdue':
            if (!card.dueDate || card.dueDate >= now) return false;
            break;
          case 'due_soon':
            if (!card.dueDate || card.dueDate > tomorrow || card.dueDate < now) return false;
            break;
          case 'no_date':
            if (card.dueDate) return false;
            break;
        }
      }
      
      // Archived filter
      if (!filters.archived && card.archived) {
        return false;
      }
      
      return true;
    }),
  }));

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ background: board.background }}
    >
      {/* Board header */}
      <div className="bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBoardSelector(!showBoardSelector)}
                className="flex items-center gap-2 text-xl font-bold text-white hover:bg-white hover:bg-opacity-20 rounded px-3 py-2 transition-colors duration-200"
              >
                <Grid3X3 className="w-5 h-5" />
                {board.title}
              </button>
              <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200">
                <Star className="w-5 h-5 text-white" />
              </button>
              {bulkSelectMode && (
                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  <span>Bulk Select Mode</span>
                  <button
                    onClick={() => {
                      setBulkSelectMode(false);
                      setSelectedCards([]);
                    }}
                    className="hover:bg-blue-700 rounded px-2 py-1"
                  >
                    Exit
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowActivity(!showActivity)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                title="Activity Timeline"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                title="Board Statistics"
              >
                <BarChart3 className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={() => setBulkSelectMode(!bulkSelectMode)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                title="Bulk Select Mode"
              >
                <Grid3X3 className="w-5 h-5 text-white" />
              </button>
              <div className="relative">
                <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200">
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </button>
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hidden group-hover:block min-w-48">
                  <button
                    onClick={handleExportBoard}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Board
                  </button>
                  <label className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import Board
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBoard}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Board content */}
        <div className="flex-1 p-4">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {filteredLists.map(list => (
              <List
                key={list.id}
                list={list}
                onCardClick={handleCardClick}
                onAddCard={handleAddCard}
                onDragStart={(cardId, listId) => handleDragStart({ type: 'card', id: cardId, listId })}
                onDragEnd={handleDragEnd}
                onDrop={handleCardDrop}
                draggedCardId={draggedItem?.type === 'card' ? draggedItem.id : null}
                dragOverListId={dragOverItem}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                selectedCards={selectedCards}
                onToggleCardSelect={handleToggleCardSelect}
                bulkSelectMode={bulkSelectMode}
              />
            ))}

            {/* Add list button */}
            <div className="flex-shrink-0">
              <button className="flex items-center gap-2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors duration-200 w-72">
                <Plus className="w-4 h-4" />
                Add another list
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="w-80 p-4 space-y-4">
          {/* Board Selector */}
          {showBoardSelector && (
            <BoardSelector
              boards={boards}
              currentBoard={board}
              onSelectBoard={(board) => {
                onSelectBoard?.(board);
                setShowBoardSelector(false);
              }}
              onCreateBoard={() => {
                onCreateBoard?.();
                setShowBoardSelector(false);
              }}
              onArchiveBoard={(boardId) => {
                // Handle board archiving
                console.log('Archive board:', boardId);
              }}
            />
          )}

          {/* Filter Panel */}
          {showFilters && (
            <FilterPanel
              filters={filters}
              onUpdateFilters={setFilters}
              onClose={() => setShowFilters(false)}
              members={board.members}
              labels={predefinedLabels}
            />
          )}

          {/* Activity Timeline */}
          {showActivity && (
            <ActivityTimeline
              activities={board.activityLog}
            />
          )}

          {/* Board Statistics */}
          {showStats && (
            <BoardStats
              board={board}
            />
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCards={selectedCards}
        lists={board.lists}
        members={board.members}
        labels={predefinedLabels}
        onBulkOperation={handleBulkOperation}
        onClearSelection={() => {
          setSelectedCards([]);
          setBulkSelectMode(false);
        }}
      />

      {/* Card modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={handleCloseModal}
          onUpdateCard={handleUpdateCard}
        />
      )}

      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-4 right-4">
        <button
          className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors duration-200"
          title="Keyboard Shortcuts: Ctrl+N (New Card), Ctrl+K (Search), Ctrl+D (Dark Mode), Shift+A (Bulk Select)"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};