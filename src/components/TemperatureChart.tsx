import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface TemperatureChartProps {
  data: Array<{ time: string; temp: number }>;
}

export const TemperatureChart = ({ data }: TemperatureChartProps) => {
  const temperatureUnit = useSelector((state: RootState) => state.settings.temperatureUnit);

  const convertedData = data.map(item => ({
    time: item.time,
    temp: temperatureUnit === 'fahrenheit' 
      ? Math.round((item.temp * 9/5) + 32)
      : item.temp,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={convertedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis 
          dataKey="time" 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
          label={{ 
            value: `Temperature (°${temperatureUnit === 'celsius' ? 'C' : 'F'})`, 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: 'hsl(var(--muted-foreground))' }
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            backdropFilter: 'blur(12px)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Line 
          type="monotone" 
          dataKey="temp" 
          stroke="hsl(var(--primary))" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--primary))', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
