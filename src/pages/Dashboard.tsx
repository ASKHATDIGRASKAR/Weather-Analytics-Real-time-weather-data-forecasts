import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CityCard } from '@/components/CityCard';
import { SearchBar } from '@/components/SearchBar';
import { SettingsDialog } from '@/components/SettingsDialog';
import { CloudSun } from 'lucide-react';

const Dashboard = () => {
  const favorites = useSelector((state: RootState) => state.weather.favorites);

  return (
    <div className="min-h-screen bg-sky-gradient">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-3">
            <CloudSun className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Weather Analytics
              </h1>
              <p className="text-muted-foreground">Real-time weather data & forecasts</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBar />
            <SettingsDialog />
          </div>
        </header>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <CloudSun className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">No Cities Added</h2>
            <p className="text-muted-foreground">Search for a city to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((city) => (
              <CityCard key={city} cityName={city} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
