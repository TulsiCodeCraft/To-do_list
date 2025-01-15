import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleComplete: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    toggleImportant: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.important = !task.important;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
  },
});

export const { addTask, deleteTask, updateTask, toggleComplete, toggleImportant } = taskSlice.actions;
export default taskSlice.reducer;

