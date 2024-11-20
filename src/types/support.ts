export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Date;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  members: number;
  isPrivate: boolean;
  description: string;
  unread?: number;
  lastPost?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName: string;
  groupId: string;
  createdAt: Date;
  likes: number;
  comments: number;
  tags?: string[];
}