import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './taskSlice';
import weatherReducer from './weatherSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    weather: weatherReducer,
  },
});

