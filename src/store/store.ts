import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice'; // Proveri da li je tačna putanja

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
