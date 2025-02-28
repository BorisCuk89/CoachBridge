import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type AuthState = {
  isAuthenticated: boolean;
  user: any;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{name: string; email: string}>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
