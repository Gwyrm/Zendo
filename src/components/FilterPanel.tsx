import React from 'react';
import { X, Calendar, User, Tag, Archive, AlertCircle } from 'lucide-react';
import { FilterOptions, Member, Label } from '../types';
import { Avatar } from './Avatar';

interface FilterPanelProps {
  filters: FilterOptions;
  onUpdateFilters: (filters: FilterOptions) => void;
  onClose: () => void;
  members: Member[];
  labels: Label[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onUpdateFilters,
  onClose,
  members,
  labels,
}) => {
  const handleMemberToggle = (memberId: string) => {
    const updatedMembers = filters.members.includes(memberId)
      ? filters.members.filter(id => id !== memberId)
      : [...filters.members, memberId];
    onUpdateFilters({ ...filters, members: updatedMembers });
  };

  const handleLabelToggle = (labelId: string) => {
    const updatedLabels = filters.labels.includes(labelId)
      ? filters.labels.filter(id => id !== labelId)
      : [...filters.labels, labelId];
    onUpdateFilters({ ...filters, labels: updatedLabels });
  };

  const handlePriorityToggle = (priority: string) => {
    const updatedPriority = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    onUpdateFilters({ ...filters, priority: updatedPriority });
  };

  const clearAllFilters = () => {
    onUpdateFilters({
      members: [],
      labels: [],
      dueDate: 'all',
      archived: false,
      priority: [],
      searchQuery: '',
    });
  };

  const hasActiveFilters = filters.members.length > 0 || 
                          filters.labels.length > 0 || 
                          filters.dueDate !== 'all' || 
                          filters.archived || 
                          filters.priority.length > 0 ||
                          filters.searchQuery.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Members Filter */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <User className="w-4 h-4" />
            Members
          </h4>
          <div className="space-y-2">
            {members.map(member => (
              <label
                key={member.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.members.includes(member.id)}
                  onChange={() => handleMemberToggle(member.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Avatar member={member} size="sm" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Labels Filter */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Tag className="w-4 h-4" />
            Labels
          </h4>
          <div className="space-y-2">
            {labels.map(label => (
              <label
                key={label.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.labels.includes(label.id)}
                  onChange={() => handleLabelToggle(label.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: label.color }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <AlertCircle className="w-4 h-4" />
            Priority
          </h4>
          <div className="space-y-2">
            {['urgent', 'high', 'medium', 'low'].map(priority => (
              <label
                key={priority}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.priority.includes(priority)}
                  onChange={() => handlePriorityToggle(priority)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm capitalize ${
                  priority === 'urgent' ? 'text-red-600 dark:text-red-400' :
                  priority === 'high' ? 'text-orange-600 dark:text-orange-400' :
                  priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Due Date Filter */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Calendar className="w-4 h-4" />
            Due Date
          </h4>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All cards' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'due_soon', label: 'Due soon (24h)' },
              { value: 'no_date', label: 'No due date' },
            ].map(option => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name="dueDate"
                  value={option.value}
                  checked={filters.dueDate === option.value}
                  onChange={(e) => onUpdateFilters({ ...filters, dueDate: e.target.value as any })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Archived Filter */}
        <div>
          <label className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={filters.archived}
              onChange={(e) => onUpdateFilters({ ...filters, archived: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Archive className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show archived cards</span>
          </label>
        </div>
      </div>
    </div>
  );
};