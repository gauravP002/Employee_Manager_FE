
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from './taskTypes';

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
  currentTask: null,
  searchQuery: '',
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchTasksRequest: (state) => {
      state.loading = true;
    },
    fetchTasksSuccess: (state, action: PayloadAction<Task[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchTaskByIdRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
    },
    fetchTaskByIdSuccess: (state, action: PayloadAction<Task>) => {
      state.loading = false;
      state.currentTask = action.payload;
    },
    createTaskRequest: (state, _action: PayloadAction<Partial<Task>>) => {
      state.loading = true;
    },
    createTaskSuccess: (state, action: PayloadAction<Task>) => {
      state.loading = false;
      state.items.unshift(action.payload);
    },
    updateTaskStatusRequest: (
      state,
      _action: PayloadAction<{ id: string; status: Task["status"] }>,
    ) => {},
    updateTaskStatusSuccess: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      if (state.currentTask?.id === action.payload.id)
        state.currentTask = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    taskError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearTask: (state, action: PayloadAction<string>) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.currentTask = null;
      state.searchQuery = "";
    },
  },
});

export const taskActions = taskSlice.actions;
export default taskSlice.reducer;
