import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001/api/trainers';

interface FeedItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: 'training' | 'meal';
  trainerId: string;
  trainerName: string;
  trainerImage: string;
  createdAt: string;
}

// 📌 Interfejs za trening pakete i planove ishrane
interface TrainingPackage {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage: string;
  introVideo: string;
  videos: string[];
}

interface MealPlan {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  introVideo: string;
  price: number;
}

// 📌 State interfejs
interface TrainerState {
  trainings: TrainingPackage[];
  mealPlans: MealPlan[];
  wallet: {totalEarnings: number; availableForPayout: number};
  feed: FeedItem[];
  favorites: FeedItem[];
  loading: boolean;
  error: string | null;
}

// 📌 Početno stanje
const initialState: TrainerState = {
  trainings: [],
  mealPlans: [],
  wallet: {totalEarnings: 0, availableForPayout: 0},
  feed: [],
  favorites: [],
  loading: false,
  error: null,
};

// 🔹 **Asinhrona akcija za dohvatanje treninga ili planova ishrane**
export const fetchTrainerContent = createAsyncThunk(
  'trainer/fetchTrainerContent',
  async (
    {
      trainerId,
      contentType,
    }: {trainerId: string; contentType: 'trainings' | 'plans'},
    thunkAPI,
  ) => {
    try {
      const response = await fetch(`${API_URL}/${trainerId}/${contentType}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Greška pri dohvatanju podataka');
      }

      return {contentType, data};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 🔹 **Asinhrona akcija za dodavanje trening paketa**
export const addTrainingPackage = createAsyncThunk(
  'trainer/addTrainingPackage',
  async (
    {
      trainerId,
      title,
      description,
      price,
      coverImage,
      introVideo,
      videos,
    }: {
      trainerId: string;
      title: string;
      description: string;
      price: number;
      coverImage: string;
      introVideo: string;
      videos: {videoUrl: string; description: string}[];
    },
    thunkAPI,
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/${trainerId}/training-packages`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            title,
            description,
            price,
            coverImage,
            introVideo,
            videos,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Greška pri dodavanju paketa');
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addMealPlan = createAsyncThunk(
  'trainer/addMealPlan',
  async (
    {
      trainerId,
      title,
      description,
      price,
      coverImage,
      introVideo,
    }: {
      trainerId: string;
      title: string;
      description: string;
      price: number;
      coverImage: string;
      introVideo: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/trainers/${trainerId}/meal-plans`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            title,
            description,
            coverImage,
            introVideo,
            price,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Greška pri dodavanju plana ishrane');
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchWallet = createAsyncThunk(
  'trainer/fetchWallet',
  async (trainerId, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/${trainerId}`);
      const data = await response.json();
      return data.wallet;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const requestPayout = createAsyncThunk(
  'trainer/requestPayout',
  async (trainerId, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/request-payout/${trainerId}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
      });

      const data = await response.json();
      return data.payoutAmount;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchGlobalFeed = createAsyncThunk(
  'trainer/fetchGlobalFeed',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/feed`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Greška pri dohvatanju feed-a');
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const loadFavorites = createAsyncThunk(
  'trainer/loadFavorites',
  async (_, thunkAPI) => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue('Greška pri učitavanju favorita');
    }
  },
);

// 📌 **Redux slice**
const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<FeedItem>) => {
      const exists = state.favorites.find(
        item => item._id === action.payload._id,
      );
      if (exists) {
        state.favorites = state.favorites.filter(
          item => item._id !== action.payload._id,
        );
      } else {
        state.favorites.push(action.payload);
      }

      // ✅ Sačuvaj u AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTrainerContent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainerContent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.contentType === 'trainings') {
          state.trainings = action.payload.data;
        } else {
          state.mealPlans = action.payload.data;
        }
      })
      .addCase(fetchTrainerContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTrainingPackage.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTrainingPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings.push(action.payload);
      })
      .addCase(addTrainingPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMealPlan.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.mealPlans.push(action.payload); // ✅ Dodajemo samo novi plan
      })
      .addCase(addMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
      })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.wallet.availableForPayout = 0; // Resetujemo stanje
      })
      .addCase(fetchGlobalFeed.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(fetchGlobalFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export const {toggleFavorite} = trainerSlice.actions;
export default trainerSlice.reducer;
