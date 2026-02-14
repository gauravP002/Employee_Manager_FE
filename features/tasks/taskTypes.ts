
export type TaskStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface CreatedBy {
      createdAt: null,
        email: string;
        id: string,
        name: string,
        role: string
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: CreatedBy;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
  currentTask: Task | null;
  searchQuery: string;
}
