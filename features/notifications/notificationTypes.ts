
export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationState {
  items: AppNotification[];
  unreadCount: number;
}
