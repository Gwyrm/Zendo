import { BoardTemplate } from '../types';

export const boardTemplates: BoardTemplate[] = [
  {
    id: 'software-dev',
    name: 'Software Development',
    description: 'Perfect for agile software development teams',
    lists: [
      { title: 'Backlog', position: 0 },
      { title: 'To Do', position: 1 },
      { title: 'In Progress', position: 2, wipLimit: 3 },
      { title: 'Code Review', position: 3 },
      { title: 'Testing', position: 4 },
      { title: 'Done', position: 5 },
    ],
    labels: [
      { id: 'bug', name: 'Bug', color: '#FF6B6B' },
      { id: 'feature', name: 'Feature', color: '#4ECDC4' },
      { id: 'enhancement', name: 'Enhancement', color: '#45B7D1' },
      { id: 'urgent', name: 'Urgent', color: '#FF8C42' },
      { id: 'documentation', name: 'Documentation', color: '#96CEB4' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing Campaign',
    description: 'Organize your marketing campaigns and content',
    lists: [
      { title: 'Ideas', position: 0 },
      { title: 'Planning', position: 1 },
      { title: 'In Production', position: 2 },
      { title: 'Review', position: 3 },
      { title: 'Scheduled', position: 4 },
      { title: 'Published', position: 5 },
    ],
    labels: [
      { id: 'social-media', name: 'Social Media', color: '#FF6B6B' },
      { id: 'blog', name: 'Blog', color: '#4ECDC4' },
      { id: 'email', name: 'Email', color: '#45B7D1' },
      { id: 'video', name: 'Video', color: '#96CEB4' },
      { id: 'design', name: 'Design', color: '#FFEAA7' },
    ],
  },
  {
    id: 'personal',
    name: 'Personal Tasks',
    description: 'Manage your personal projects and daily tasks',
    lists: [
      { title: 'Inbox', position: 0 },
      { title: 'Today', position: 1 },
      { title: 'This Week', position: 2 },
      { title: 'Someday', position: 3 },
      { title: 'Completed', position: 4 },
    ],
    labels: [
      { id: 'urgent', name: 'Urgent', color: '#FF6B6B' },
      { id: 'important', name: 'Important', color: '#FF8C42' },
      { id: 'personal', name: 'Personal', color: '#4ECDC4' },
      { id: 'work', name: 'Work', color: '#45B7D1' },
      { id: 'health', name: 'Health', color: '#96CEB4' },
    ],
  },
  {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Plan and organize events with detailed task tracking',
    lists: [
      { title: 'Initial Planning', position: 0 },
      { title: 'Venue & Logistics', position: 1 },
      { title: 'Marketing & Promotion', position: 2 },
      { title: 'Final Preparations', position: 3 },
      { title: 'Event Day', position: 4 },
      { title: 'Post-Event', position: 5 },
    ],
    labels: [
      { id: 'venue', name: 'Venue', color: '#FF6B6B' },
      { id: 'catering', name: 'Catering', color: '#4ECDC4' },
      { id: 'marketing', name: 'Marketing', color: '#45B7D1' },
      { id: 'logistics', name: 'Logistics', color: '#96CEB4' },
      { id: 'budget', name: 'Budget', color: '#FFEAA7' },
    ],
  },
];