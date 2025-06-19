import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  CheckSquare,
  MessageCircle,
  Tag,
  User,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Check,
} from 'lucide-react';
import { Card as CardType, ChecklistItem, Comment, Label as LabelType, Member } from '../types';
import { Label } from './Label';
import { Avatar } from './Avatar';
import { predefinedLabels, defaultMembers } from '../data/mockData';

interface CardModalProps {
  card: CardType;
  onClose: () => void;
  onUpdateCard: (cardId: string, updates: Partial<CardType>) => void;
}

export const CardModal: React.FC<CardModalProps> = ({ card, onClose, onUpdateCard }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [newComment, setNewComment] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleUpdateCard = (updates: Partial<CardType>) => {
    onUpdateCard(card.id, updates);
  };

  const handleTitleSave = () => {
    if (title.trim() && title !== card.title) {
      handleUpdateCard({ title: title.trim() });
    }
    setEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (description !== card.description) {
      handleUpdateCard({ description });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        author: 'Current User',
        timestamp: new Date(),
      };
      handleUpdateCard({ comments: [...card.comments, comment] });
      setNewComment('');
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    handleUpdateCard({ checklist: updatedChecklist });
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistItem.trim()) {
      const item: ChecklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false,
      };
      handleUpdateCard({ checklist: [...card.checklist, item] });
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist.filter(item => item.id !== itemId);
    handleUpdateCard({ checklist: updatedChecklist });
  };

  const handleToggleLabel = (label: LabelType) => {
    const hasLabel = card.labels.some(l => l.id === label.id);
    const updatedLabels = hasLabel
      ? card.labels.filter(l => l.id !== label.id)
      : [...card.labels, label];
    handleUpdateCard({ labels: updatedLabels });
  };

  const handleToggleMember = (member: Member) => {
    const hasMember = card.members.some(m => m.id === member.id);
    const updatedMembers = hasMember
      ? card.members.filter(m => m.id !== member.id)
      : [...card.members, member];
    handleUpdateCard({ members: updatedMembers });
  };

  const handleSetDueDate = (date: string) => {
    const dueDate = date ? new Date(date) : undefined;
    handleUpdateCard({ dueDate });
  };

  const completedTasks = card.checklist.filter(item => item.completed).length;
  const totalTasks = card.checklist.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
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
                className="text-xl font-semibold text-gray-900 bg-transparent border-2 border-blue-500 rounded px-2 py-1 w-full focus:outline-none"
                autoFocus
              />
            ) : (
              <h1
                className="text-xl font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -mx-2"
                onClick={() => setEditingTitle(true)}
              >
                {card.title}
              </h1>
            )}
            <p className="text-sm text-gray-600 mt-1">
              in list <span className="font-medium">{card.listId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Labels */}
          {card.labels.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {card.labels.map(label => (
                  <Label key={label.id} label={label} size="md" />
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {card.members.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Members</h3>
              <div className="flex gap-2">
                {card.members.map(member => (
                  <div key={member.id} className="flex items-center gap-2">
                    <Avatar member={member} size="md" />
                    <span className="text-sm font-medium text-gray-700">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          {card.dueDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Due Date</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {card.dueDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionSave}
              placeholder="Add a more detailed description..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Checklist */}
          {card.checklist.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Checklist ({completedTasks}/{totalTasks})
                </h3>
                <span className="text-xs text-gray-500">{Math.round(progressPercentage)}% complete</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Checklist items */}
              <div className="space-y-2">
                {card.checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-3 group">
                    <button
                      onClick={() => handleToggleChecklistItem(item.id)}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        ${item.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      {item.completed && <Check className="w-3 h-3" />}
                    </button>
                    <span
                      className={`
                        flex-1 text-sm
                        ${item.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-700'
                        }
                      `}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add checklist item */}
          <form onSubmit={handleAddChecklistItem} className="flex gap-2">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Add a checklist item..."
              className="flex-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Add
            </button>
          </form>

          {/* Comments */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Activity ({card.comments.length})
            </h3>
            
            {/* Add comment */}
            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
              >
                Comment
              </button>
            </form>

            {/* Comments list */}
            <div className="space-y-3">
              {card.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                    {comment.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Labels dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
              >
                <Tag className="w-4 h-4" />
                Labels
              </button>
              {showLabelDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {predefinedLabels.map(label => (
                    <button
                      key={label.id}
                      onClick={() => handleToggleLabel(label)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: label.color }}
                      />
                      {label.name}
                      {card.labels.some(l => l.id === label.id) && (
                        <Check className="w-4 h-4 ml-auto text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Members dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                Members
              </button>
              {showMemberDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {defaultMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => handleToggleMember(member)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <Avatar member={member} size="sm" />
                      {member.name}
                      {card.members.some(m => m.id === member.id) && (
                        <Check className="w-4 h-4 ml-auto text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Due date */}
            <div>
              <input
                type="date"
                onChange={(e) => handleSetDueDate(e.target.value)}
                value={card.dueDate ? card.dueDate.toISOString().split('T')[0] : ''}
                className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};