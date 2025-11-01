import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { TemperatureChart } from '@/components/TemperatureChart';
import { PrecipitationChart } from '@/components/PrecipitationChart';

const getWeatherIcon = (icon: string) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

const CityDetails = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const temperatureUnit = useSelector((state: RootState) => state.settings.temperatureUnit);
  const weatherCache = useSelector((state: RootState) => 
    cityName ? state.weather.weatherCache[cityName] : null
  );

  if (!weatherCache || !cityName) {
    return (
      <div className="min-h-screen bg-sky-gradient flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">City not found</h2>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const { data, forecast, hourly } = weatherCache;

  const convertTemp = (temp: number) => {
    if (temperatureUnit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  return (
    <div className="min-h-screen bg-sky-gradient">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6 bg-card/80 backdrop-blur-md border-border/50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid gap-6">
          {/* Current Weather Header */}
          <Card className="p-8 bg-card/80 backdrop-blur-md border-border/50 shadow-glass">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{data.name}, {data.country}</h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">
                    {convertTemp(data.temp)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
                  </span>
                  <span className="text-xl text-muted-foreground">
                    Feels like {convertTemp(data.feelsLike)}°
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={getWeatherIcon(data.icon)}
                  alt={data.condition}
                  className="w-32 h-32"
                />
                <span className="text-xl font-semibold">{data.condition}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
              <div>
                <div className="text-sm text-muted-foreground">Humidity</div>
                <div className="text-2xl font-bold">{data.humidity}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Wind Speed</div>
                <div className="text-2xl font-bold">{data.windSpeed} km/h</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Feels Like</div>
                <div className="text-2xl font-bold">
                  {convertTemp(data.feelsLike)}°
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="text-sm font-medium">
                  {new Date(data.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Hourly Forecast Chart */}
          <Card className="p-6 bg-card/80 backdrop-blur-md border-border/50 shadow-glass">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">24-Hour Temperature Trend</h2>
            </div>
            <TemperatureChart data={hourly} />
          </Card>

          {/* Precipitation Chart */}
          <Card className="p-6 bg-card/80 backdrop-blur-md border-border/50 shadow-glass">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Precipitation Forecast</h2>
            </div>
            <PrecipitationChart data={hourly} />
          </Card>

          {/* 5-Day Forecast */}
          <Card className="p-6 bg-card/80 backdrop-blur-md border-border/50 shadow-glass">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">5-Day Forecast</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-secondary/30 backdrop-blur-sm text-center hover:bg-secondary/50 transition-colors"
                >
                  <div className="font-semibold mb-2">{day.date}</div>
                  <img
                    src={getWeatherIcon(day.icon)}
                    alt={day.condition}
                    className="w-16 h-16 mx-auto"
                  />
                  <div className="text-sm font-medium mb-1">{day.condition}</div>
                  <div className="flex justify-center gap-2 text-sm">
                    <span className="font-bold">
                      {convertTemp(day.maxTemp)}°
                    </span>
                    <span className="text-muted-foreground">
                      {convertTemp(day.minTemp)}°
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    💧 {day.precipChance}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
