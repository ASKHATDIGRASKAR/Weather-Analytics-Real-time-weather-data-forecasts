import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WeatherData {
  id: string;
  name: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  timestamp: number;
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  precipChance: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  precipChance: number;
}

interface WeatherState {
  favorites: string[];
  weatherCache: Record<string, { data: WeatherData; forecast: ForecastDay[]; hourly: HourlyForecast[] }>;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  favorites: JSON.parse(localStorage.getItem('weatherFavorites') || '["London", "New York", "Tokyo"]'),
  weatherCache: {},
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        localStorage.setItem('weatherFavorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(city => city !== action.payload);
      localStorage.setItem('weatherFavorites', JSON.stringify(state.favorites));
    },
    updateWeatherCache: (state, action: PayloadAction<{ cityId: string; data: WeatherData; forecast: ForecastDay[]; hourly: HourlyForecast[] }>) => {
      state.weatherCache[action.payload.cityId] = {
        data: action.payload.data,
        forecast: action.payload.forecast,
        hourly: action.payload.hourly,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, updateWeatherCache, setLoading, setError } = weatherSlice.actions;
export default weatherSlice.reducer;
