import React from 'react';
import { Move, Archive, Tag, User, X } from 'lucide-react';
import { BulkOperation, List, Member, Label } from '../types';

interface BulkActionsProps {
  selectedCards: string[];
  lists: List[];
  members: Member[];
  labels: Label[];
  onBulkOperation: (operation: BulkOperation) => void;
  onClearSelection: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCards,
  lists,
  members,
  labels,
  onBulkOperation,
  onClearSelection,
}) => {
  if (selectedCards.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {selectedCards.length} card{selectedCards.length > 1 ? 's' : ''} selected
        </span>

        <div className="flex items-center gap-2">
          {/* Move to list */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
              <Move className="w-4 h-4" />
              Move
            </button>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => onBulkOperation({
                    type: 'move',
                    cardIds: selectedCards,
                    targetListId: list.id,
                  })}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{list.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Assign member */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200">
              <User className="w-4 h-4" />
              Assign
            </button>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48">
              {members.map(member => (
                <button
                  key={member.id}
                  onClick={() => onBulkOperation({
                    type: 'assign',
                    cardIds: selectedCards,
                    targetMember: member,
                  })}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    {member.initials}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add label */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200">
              <Tag className="w-4 h-4" />
              Label
            </button>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48">
              {labels.map(label => (
                <button
                  key={label.id}
                  onClick={() => onBulkOperation({
                    type: 'label',
                    cardIds: selectedCards,
                    targetLabel: label,
                  })}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Archive */}
          <button
            onClick={() => onBulkOperation({
              type: 'archive',
              cardIds: selectedCards,
            })}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
          >
            <Archive className="w-4 h-4" />
            Archive
          </button>

          {/* Clear selection */}
          <button
            onClick={onClearSelection}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};