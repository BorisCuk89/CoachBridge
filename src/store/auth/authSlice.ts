import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001/api/auth';

// 📌 Interfejs za korisnika
interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'trainer';
}

interface Client extends BaseUser {
  role: 'client';
}

interface Trainer extends BaseUser {
  role: 'trainer';
  title: string;
  description: string;
  profileImage?: string;
  certificates?: string[];
  rating?: number;
}

type User = Client | Trainer;

// 📌 AuthState interfejs
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 📌 Početno stanje
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// 🔹 Asinhrona akcija za učitavanje korisnika iz AsyncStorage-a
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (token && user) {
        return {token, user: JSON.parse(user) as User};
      }

      return thunkAPI.rejectWithValue('Nema sačuvanog korisnika');
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

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

      const account: User = data.user || data.trainer;

      console.log(account);

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(account));

      return {token: data.token, user: account};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 🔹 Asinhrona akcija za registraciju trenera
export const registerTrainer = createAsyncThunk(
  'auth/registerTrainer',
  async (
    {
      name,
      email,
      password,
      title,
      description,
      profileImage = '',
      certificates = [],
      role,
    }: {
      name: string;
      email: string;
      password: string;
      title: string;
      description: string;
      profileImage?: string;
      certificates?: string[];
      role: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await fetch(
        'http://localhost:5001/api/trainers/register',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name,
            email,
            password,
            title,
            description,
            profileImage,
            certificates,
            role,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Neuspešna registracija');
      }

      // ✅ Sačuvaj token i korisnika u AsyncStorage
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.trainer));

      // 📌 Nakon registracije, odmah prijavljujemo korisnika
      return {token: data.token, user: data.trainer};
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
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, state => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(registerTrainer.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {loadUserFromStorage} = authSlice.actions;
export default authSlice.reducer;
