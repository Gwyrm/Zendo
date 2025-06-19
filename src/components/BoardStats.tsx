import React from 'react';
import { BarChart3, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { Board } from '../types';

interface BoardStatsProps {
  board: Board;
  className?: string;
}

export const BoardStats: React.FC<BoardStatsProps> = ({ board, className = '' }) => {
  const totalCards = board.lists.reduce((acc, list) => acc + list.cards.length, 0);
  const completedCards = board.lists
    .find(list => list.title.toLowerCase().includes('done') || list.title.toLowerCase().includes('complete'))
    ?.cards.length || 0;
  
  const overdueTasks = board.lists
    .flatMap(list => list.cards)
    .filter(card => card.dueDate && new Date() > card.dueDate).length;
  
  const totalTimeSpent = board.lists
    .flatMap(list => list.cards)
    .flatMap(card => card.timeEntries)
    .reduce((acc, entry) => acc + entry.duration, 0);

  const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

  const stats = [
    {
      label: 'Total Cards',
      value: totalCards,
      icon: <BarChart3 className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Completed',
      value: completedCards,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      color: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      label: 'Time Spent',
      value: `${Math.round(totalTimeSpent / 60)}h`,
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Team Members',
      value: board.members.length,
      icon: <Users className="w-5 h-5 text-indigo-500" />,
      color: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Board Statistics
        </h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Rate */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Completion Rate
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* List Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Cards per List
          </h4>
          <div className="space-y-2">
            {board.lists.map(list => {
              const percentage = totalCards > 0 ? (list.cards.length / totalCards) * 100 : 0;
              return (
                <div key={list.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-20 truncate">
                    {list.title}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                    {list.cards.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};