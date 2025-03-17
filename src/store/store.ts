import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import trainerReducer from './trainer/trainerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trainer: trainerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
