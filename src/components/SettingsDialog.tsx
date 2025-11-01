import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDispatch, useSelector } from 'react-redux';
import { setTemperatureUnit } from '@/store/settingsSlice';
import { RootState } from '@/store/store';

export const SettingsDialog = () => {
  const dispatch = useDispatch();
  const temperatureUnit = useSelector((state: RootState) => state.settings.temperatureUnit);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-md border-border/50">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your weather dashboard preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Temperature Unit</Label>
            <RadioGroup
              value={temperatureUnit}
              onValueChange={(value: 'celsius' | 'fahrenheit') => dispatch(setTemperatureUnit(value))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="celsius" id="celsius" />
                <Label htmlFor="celsius" className="cursor-pointer">Celsius (°C)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                <Label htmlFor="fahrenheit" className="cursor-pointer">Fahrenheit (°F)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
