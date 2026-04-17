import { configureStore } from '@reduxjs/toolkit';
import studentProfileReducer from './studentProfileSlice';

export const store = configureStore({
  reducer: {
    studentProfile: studentProfileReducer,
  },
});
