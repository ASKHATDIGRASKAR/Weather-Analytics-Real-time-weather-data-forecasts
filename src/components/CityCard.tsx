import { useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Heart, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentWeather, getForecast } from '@/services/weatherApi';
import { updateWeatherCache, removeFavorite } from '@/store/weatherSlice';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CityCardProps {
  cityName: string;
}

const getWeatherIcon = (icon: string) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

export const CityCard = ({ cityName }: CityCardProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const temperatureUnit = useSelector((state: RootState) => state.settings.temperatureUnit);
  const weatherData = useSelector((state: RootState) => state.weather.weatherCache[cityName]?.data);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const [current, forecastData] = await Promise.all([
          getCurrentWeather(cityName),
          getForecast(cityName),
        ]);
        
        dispatch(updateWeatherCache({
          cityId: cityName,
          data: current,
          forecast: forecastData.forecast,
          hourly: forecastData.hourly,
        }));
      } catch (error: any) {
        console.error('Error fetching weather:', error);
        const errorMessage = error?.response?.status === 401 
          ? 'API key is invalid or still activating (takes 10-15 min)' 
          : 'Failed to fetch weather data';
        setError(errorMessage);
        toast({
          title: `Error loading ${cityName}`,
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchWeather();

    // Refresh every 60 seconds
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, [cityName, dispatch]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFavorite(cityName));
  };

  const convertTemp = (temp: number) => {
    if (temperatureUnit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card/80 backdrop-blur-md border-border/50 shadow-glass">
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading {cityName}...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-card/80 backdrop-blur-md border-border/50 shadow-glass">
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">{cityName}</h3>
            <p className="text-sm text-destructive mb-2">{error}</p>
            <button
              onClick={handleRemove}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Remove city
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (!weatherData) return null;

  return (
    <Card
      onClick={() => navigate(`/city/${cityName}`)}
      className="group p-6 bg-card/80 backdrop-blur-md border-border/50 shadow-glass hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold">{weatherData.name}</h3>
          <p className="text-sm text-muted-foreground">{weatherData.country}</p>
        </div>
        <button
          onClick={handleRemove}
          className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
        >
          <Heart className="h-5 w-5 fill-destructive text-destructive" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-5xl font-bold">
            {convertTemp(weatherData.temp)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Feels like {convertTemp(weatherData.feelsLike)}°
          </div>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={getWeatherIcon(weatherData.icon)}
            alt={weatherData.condition}
            className="w-24 h-24"
          />
          <span className="text-sm font-medium">{weatherData.condition}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-primary" />
          <div className="text-xs">
            <div className="text-muted-foreground">Humidity</div>
            <div className="font-medium">{weatherData.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-primary" />
          <div className="text-xs">
            <div className="text-muted-foreground">Wind</div>
            <div className="font-medium">{weatherData.windSpeed} km/h</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          <div className="text-xs">
            <div className="text-muted-foreground">Pressure</div>
            <div className="font-medium">Normal</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
