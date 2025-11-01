import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCities } from '@/services/weatherApi';
import { useDispatch } from 'react-redux';
import { addFavorite } from '@/store/weatherSlice';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ name: string; country: string }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      const cities = await searchCities(query);
      setResults(cities);
      setIsOpen(true);
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (cityName: string) => {
    dispatch(addFavorite(cityName));
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="pl-10 bg-card/80 backdrop-blur-sm border-border/50"
        />
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-glass overflow-hidden">
          {results.map((city, index) => (
            <button
              key={index}
              onClick={() => handleSelect(city.name)}
              className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex justify-between items-center"
            >
              <span className="font-medium">{city.name}</span>
              <span className="text-sm text-muted-foreground">{city.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
