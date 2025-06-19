import React, { useState } from 'react';
import { MoreHorizontal, Plus, Archive, Edit3, Trash2 } from 'lucide-react';
import { List as ListType, Card as CardType } from '../types';
import { Card } from './Card';
import { AddCard } from './AddCard';

interface ListProps {
  list: ListType;
  onCardClick: (card: CardType) => void;
  onAddCard: (listId: string, title: string) => void;
  onDragStart: (cardId: string, listId: string) => void;
  onDragEnd: () => void;
  onDrop: (cardId: string, targetListId: string) => void;
  draggedCardId: string | null;
  dragOverListId: string | null;
  onDragEnter: (listId: string) => void;
  onDragLeave: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onUpdateList?: (listId: string, updates: Partial<ListType>) => void;
  onArchiveList?: (listId: string) => void;
  onDeleteList?: (listId: string) => void;
  selectedCards?: string[];
  onToggleCardSelect?: (cardId: string) => void;
  bulkSelectMode?: boolean;
}

export const List: React.FC<ListProps> = ({
  list,
  onCardClick,
  onAddCard,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedCardId,
  dragOverListId,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onUpdateList,
  onArchiveList,
  onDeleteList,
  selectedCards = [],
  onToggleCardSelect,
  bulkSelectMode = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedCardId) {
      onDrop(draggedCardId, list.id);
    }
  };

  const handleTitleSave = () => {
    if (title.trim() && title !== list.title && onUpdateList) {
      onUpdateList(list.id, { title: title.trim() });
    }
    setEditingTitle(false);
  };

  const visibleCards = list.cards.filter(card => !card.archived);
  const isOverWipLimit = list.wipLimit && visibleCards.length > list.wipLimit;

  return (
    <div
      className={`
        bg-gray-100 dark:bg-gray-700 rounded-lg p-3 w-72 flex-shrink-0
        transition-all duration-200 ease-in-out
        ${dragOverListId === list.id ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300 dark:ring-blue-600' : ''}
        ${list.archived ? 'opacity-60' : ''}
      `}
      onDragEnter={() => onDragEnter(list.id)}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      {/* List header */}
      <div className="flex items-center justify-between mb-3">
        {editingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') setEditingTitle(false);
            }}
            className="font-semibold text-gray-800 dark:text-white text-sm bg-transparent border-2 border-blue-500 rounded px-2 py-1 flex-1 focus:outline-none"
            autoFocus
          />
        ) : (
          <h2 
            className="font-semibold text-gray-800 dark:text-white text-sm truncate flex-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1 -mx-2"
            onClick={() => setEditingTitle(true)}
          >
            {list.title}
            {list.archived && (
              <span className="ml-2 text-xs text-gray-500 bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded">
                Archived
              </span>
            )}
          </h2>
        )}
        
        <div className="flex items-center gap-1">
          <span className={`text-xs px-2 py-1 rounded-full ${
            isOverWipLimit 
              ? 'bg-red-200 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
          }`}>
            {visibleCards.length}
            {list.wipLimit && `/${list.wipLimit}`}
          </span>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-48">
                <button
                  onClick={() => {
                    setEditingTitle(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit title
                </button>
                {onArchiveList && (
                  <button
                    onClick={() => {
                      onArchiveList(list.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Archive list
                  </button>
                )}
                {onDeleteList && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
                        onDeleteList(list.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg flex items-center gap-2 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete list
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WIP Limit Warning */}
      {isOverWipLimit && (
        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
          ⚠️ WIP limit exceeded ({visibleCards.length}/{list.wipLimit})
        </div>
      )}

      {/* Cards */}
      <div className="space-y-0 min-h-[8px]">
        {visibleCards.map(card => (
          <Card
            key={card.id}
            card={card}
            onCardClick={() => onCardClick(card)}
            onDragStart={() => onDragStart(card.id, list.id)}
            onDragEnd={onDragEnd}
            isDragging={draggedCardId === card.id}
            isSelected={selectedCards.includes(card.id)}
            onToggleSelect={() => onToggleCardSelect?.(card.id)}
            bulkSelectMode={bulkSelectMode}
          />
        ))}
      </div>

      {/* Add card */}
      {!list.archived && (
        <div className="mt-2">
          <AddCard onAddCard={(title) => onAddCard(list.id, title)} />
        </div>
      )}
    </div>
  );
};