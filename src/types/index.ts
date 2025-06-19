export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  email?: string;
}

export interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  description?: string;
}

export interface CardDependency {
  id: string;
  dependsOn: string; // card id
  type: 'blocks' | 'blocked_by';
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  labels: Label[];
  dueDate?: Date;
  checklist: ChecklistItem[];
  comments: Comment[];
  members: Member[];
  listId: string;
  position: number;
  archived?: boolean;
  createdAt: Date;
  updatedAt: Date;
  timeEntries: TimeEntry[];
  dependencies: CardDependency[];
  estimatedHours?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  boardId: string;
  position: number;
  archived?: boolean;
  wipLimit?: number;
}

export interface ActivityLog {
  id: string;
  type: 'card_created' | 'card_moved' | 'card_updated' | 'card_archived' | 'list_created' | 'list_updated' | 'member_added' | 'comment_added';
  description: string;
  user: string;
  timestamp: Date;
  cardId?: string;
  listId?: string;
}

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  lists: Omit<List, 'id' | 'boardId' | 'cards'>[];
  labels: Label[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  background: string;
  lists: List[];
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
  archived?: boolean;
  activityLog: ActivityLog[];
  settings: {
    allowComments: boolean;
    allowVoting: boolean;
    cardAging: boolean;
  };
}

export interface FilterOptions {
  members: string[];
  labels: string[];
  dueDate: 'overdue' | 'due_soon' | 'no_date' | 'all';
  archived: boolean;
  priority: string[];
  searchQuery: string;
}

export interface BulkOperation {
  type: 'move' | 'archive' | 'assign' | 'label';
  cardIds: string[];
  targetListId?: string;
  targetMember?: Member;
  targetLabel?: Label;
}