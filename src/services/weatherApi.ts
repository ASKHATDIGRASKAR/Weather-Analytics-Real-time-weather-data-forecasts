import axios from 'axios';
import { WeatherData, ForecastDay, HourlyForecast } from '@/store/weatherSlice';

const API_KEY = '4c4a435c26968ca6508918a0ff2f21af';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Cache with 60-second expiry
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 60 seconds

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const searchCities = async (query: string): Promise<Array<{ name: string; country: string; lat: number; lon: number }>> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await axios.get(`${BASE_URL}/find`, {
      params: {
        q: query,
        appid: API_KEY,
        cnt: 5,
      },
    });
    
    return response.data.list.map((city: any) => ({
      name: city.name,
      country: city.sys.country,
      lat: city.coord.lat,
      lon: city.coord.lon,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  const cacheKey = `current_${city}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });

  const data: WeatherData = {
    id: response.data.id.toString(),
    name: response.data.name,
    country: response.data.sys.country,
    temp: Math.round(response.data.main.temp),
    feelsLike: Math.round(response.data.main.feels_like),
    humidity: response.data.main.humidity,
    windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
    condition: response.data.weather[0].main,
    icon: response.data.weather[0].icon,
    timestamp: Date.now(),
  };

  setCachedData(cacheKey, data);
  return data;
};

export const getForecast = async (city: string): Promise<{ forecast: ForecastDay[]; hourly: HourlyForecast[] }> => {
  const cacheKey = `forecast_${city}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
      cnt: 40, // 5 days worth of 3-hour intervals
    },
  });

  // Process daily forecast
  const dailyMap = new Map<string, any>();
  response.data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        temps: [item.main.temp],
        conditions: [item.weather[0].main],
        icons: [item.weather[0].icon],
        precip: [item.pop * 100],
      });
    } else {
      const day = dailyMap.get(date);
      day.temps.push(item.main.temp);
      day.conditions.push(item.weather[0].main);
      day.icons.push(item.weather[0].icon);
      day.precip.push(item.pop * 100);
    }
  });

  const forecast: ForecastDay[] = Array.from(dailyMap.entries()).slice(0, 5).map(([date, data]) => ({
    date,
    maxTemp: Math.round(Math.max(...data.temps)),
    minTemp: Math.round(Math.min(...data.temps)),
    condition: data.conditions[0],
    icon: data.icons[0],
    precipChance: Math.round(Math.max(...data.precip)),
  }));

  // Process hourly forecast (next 24 hours)
  const hourly: HourlyForecast[] = response.data.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temp: Math.round(item.main.temp),
    condition: item.weather[0].main,
    icon: item.weather[0].icon,
    precipChance: Math.round(item.pop * 100),
  }));

  const result = { forecast, hourly };
  setCachedData(cacheKey, result);
  return result;
};
