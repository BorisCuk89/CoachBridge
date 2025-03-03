import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001/api/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Početno stanje
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// 🔹 Asinhrona akcija za login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({email, password}: {email: string; password: string}, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Neuspešan login');
      }

      // 📌 Sačuvaj token i user podatke u AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 🔹 Asinhrona akcija za logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadUserFromStorage: (
      state,
      action: PayloadAction<{user: User | null; token: string | null}>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const {loadUserFromStorage} = authSlice.actions;
export default authSlice.reducer;
