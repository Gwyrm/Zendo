import React from 'react';
import { Clock, User, Move, Plus, Archive, MessageCircle } from 'lucide-react';
import { ActivityLog } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  activities: ActivityLog[];
  className?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  className = '',
}) => {
  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'card_created':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'card_moved':
        return <Move className="w-4 h-4 text-blue-500" />;
      case 'card_updated':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'card_archived':
        return <Archive className="w-4 h-4 text-gray-500" />;
      case 'comment_added':
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case 'member_added':
        return <User className="w-4 h-4 text-indigo-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Activity Timeline
        </h3>
      </div>

      <div className="p-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 20).map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};