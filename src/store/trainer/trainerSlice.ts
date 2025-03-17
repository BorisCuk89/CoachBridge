import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001/api/trainers';

// 📌 Interfejs za trening pakete i planove ishrane
interface TrainingPackage {
  _id: string;
  title: string;
  description: string;
  price: number;
  videos: string[];
}

interface MealPlan {
  _id: string;
  title: string;
  description: string;
  price: number;
}

// 📌 State interfejs
interface TrainerState {
  trainings: TrainingPackage[];
  plans: MealPlan[];
  loading: boolean;
  error: string | null;
}

// 📌 Početno stanje
const initialState: TrainerState = {
  trainings: [],
  plans: [],
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

      console.log('data ', data);

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
      videos,
    }: {
      trainerId: string;
      title: string;
      description: string;
      price: number;
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
          body: JSON.stringify({title, description, price, videos}),
        },
      );

      const data = await response.json();

      console.log('data ', data);

      if (!response.ok) {
        throw new Error(data.msg || 'Greška pri dodavanju paketa');
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// 📌 **Redux slice**
const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {},
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
          state.plans = action.payload.data;
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
      });
  },
});

export default trainerSlice.reducer;
