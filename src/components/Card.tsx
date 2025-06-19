import React from 'react';
import { Calendar, CheckSquare, MessageCircle, User, Clock, AlertTriangle, Link } from 'lucide-react';
import { Card as CardType } from '../types';
import { Label } from './Label';
import { Avatar } from './Avatar';
import { formatDistanceToNow } from 'date-fns';

interface CardProps {
  card: CardType;
  onCardClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  bulkSelectMode?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  onCardClick,
  onDragStart,
  onDragEnd,
  isDragging,
  isSelected = false,
  onToggleSelect,
  bulkSelectMode = false,
}) => {
  const completedTasks = card.checklist.filter(item => item.completed).length;
  const totalTasks = card.checklist.length;
  
  // Validate date before using it
  const isValidDate = (date: any) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };
  
  const validDueDate = card.dueDate && isValidDate(card.dueDate) ? new Date(card.dueDate) : null;
  const isOverdue = validDueDate && new Date() > validDueDate;
  const isDueSoon = validDueDate && new Date(Date.now() + 24 * 60 * 60 * 1000) > validDueDate && !isOverdue;
  const totalTimeSpent = card.timeEntries.reduce((acc, entry) => acc + entry.duration, 0);
  const hasDependencies = card.dependencies.length > 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (bulkSelectMode && onToggleSelect) {
      e.stopPropagation();
      onToggleSelect();
    } else {
      onCardClick();
    }
  };

  return (
    <div
      draggable={!bulkSelectMode}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md
        p-3 mb-3 cursor-pointer border-l-4 ${getPriorityColor(card.priority)}
        transition-all duration-200 ease-in-out
        hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700
        ${isDragging ? 'opacity-50 rotate-2 scale-95' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
        ${card.archived ? 'opacity-60' : ''}
      `}
    >
      {/* Selection checkbox */}
      {bulkSelectMode && (
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.slice(0, 3).map(label => (
            <Label key={label.id} label={label} />
          ))}
          {card.labels.length > 3 && (
            <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
              +{card.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 leading-snug">
        {card.title}
        {card.archived && (
          <span className="ml-2 text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
            Archived
          </span>
        )}
      </h3>

      {/* Description preview */}
      {card.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Dependencies indicator */}
      {hasDependencies && (
        <div className="flex items-center gap-1 mb-2">
          <Link className="w-3 h-3 text-orange-500" />
          <span className="text-xs text-orange-600 dark:text-orange-400">
            {card.dependencies.length} dependencies
          </span>
        </div>
      )}

      {/* Card indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Due date */}
          {validDueDate && (
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
              ${isOverdue 
                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
                : isDueSoon 
                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}>
              {isOverdue && <AlertTriangle className="w-3 h-3" />}
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(validDueDate, { addSuffix: true })}
            </div>
          )}

          {/* Checklist progress */}
          {totalTasks > 0 && (
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
              ${completedTasks === totalTasks 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}>
              <CheckSquare className="w-3 h-3" />
              {completedTasks}/{totalTasks}
            </div>
          )}

          {/* Comments */}
          {card.comments.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium">
              <MessageCircle className="w-3 h-3" />
              {card.comments.length}
            </div>
          )}

          {/* Time tracking */}
          {totalTimeSpent > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-medium">
              <Clock className="w-3 h-3" />
              {Math.round(totalTimeSpent / 60)}h
            </div>
          )}
        </div>

        {/* Members */}
        {card.members.length > 0 && (
          <div className="flex -space-x-1">
            {card.members.slice(0, 3).map(member => (
              <Avatar
                key={member.id}
                member={member}
                size="sm"
                className="ring-2 ring-white dark:ring-gray-800"
              />
            ))}
            {card.members.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                +{card.members.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};