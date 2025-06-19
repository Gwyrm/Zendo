import React, { useState } from 'react';
import { Plus, Folder, Star, Archive, Settings } from 'lucide-react';
import { Board, BoardTemplate } from '../types';
import { boardTemplates } from '../data/boardTemplates';

interface BoardSelectorProps {
  boards: Board[];
  currentBoard: Board;
  onSelectBoard: (board: Board) => void;
  onCreateBoard: (template?: BoardTemplate) => void;
  onArchiveBoard: (boardId: string) => void;
  className?: string;
}

export const BoardSelector: React.FC<BoardSelectorProps> = ({
  boards,
  currentBoard,
  onSelectBoard,
  onCreateBoard,
  onArchiveBoard,
  className = '',
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const activeBoards = boards.filter(board => !board.archived);
  const archivedBoards = boards.filter(board => board.archived);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Boards</h3>
      </div>

      <div className="p-4 space-y-2">
        {/* Current Board */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Board</h4>
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div 
              className="w-4 h-4 rounded"
              style={{ background: currentBoard.background }}
            />
            <span className="font-medium text-gray-900 dark:text-white">{currentBoard.title}</span>
            <Star className="w-4 h-4 text-yellow-500 ml-auto" />
          </div>
        </div>

        {/* Active Boards */}
        {activeBoards.length > 1 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Boards</h4>
            <div className="space-y-1">
              {activeBoards
                .filter(board => board.id !== currentBoard.id)
                .map(board => (
                  <button
                    key={board.id}
                    onClick={() => onSelectBoard(board)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ background: board.background }}
                    />
                    <span className="text-gray-900 dark:text-white">{board.title}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {board.lists.reduce((acc, list) => acc + list.cards.length, 0)} cards
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Create New Board */}
        <div className="space-y-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">Create New Board</span>
          </button>

          {showTemplates && (
            <div className="ml-4 space-y-1">
              <button
                onClick={() => onCreateBoard()}
                className="w-full flex items-center gap-2 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
              >
                <Folder className="w-3 h-3 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">Blank Board</span>
              </button>
              {boardTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => onCreateBoard(template)}
                  className="w-full flex items-center gap-2 p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                >
                  <Folder className="w-3 h-3 text-gray-500" />
                  <div className="text-left">
                    <div className="text-gray-700 dark:text-gray-300">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Archived Boards */}
        {archivedBoards.length > 0 && (
          <div>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <Archive className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Archived Boards ({archivedBoards.length})</span>
            </button>
            
            {showArchived && (
              <div className="ml-4 mt-2 space-y-1">
                {archivedBoards.map(board => (
                  <div
                    key={board.id}
                    className="flex items-center gap-2 p-2 text-sm"
                  >
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ background: board.background }}
                    />
                    <span className="text-gray-600 dark:text-gray-400 flex-1">{board.title}</span>
                    <button
                      onClick={() => onSelectBoard(board)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};