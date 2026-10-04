import { useEffect, useState } from 'react';
import { fetchWeatherByCoords, getCurrentPosition, getDefaultWeather } from '../services/weatherService';
import type { WeatherData } from '../types';

interface UseWeatherResult {
  weather: WeatherData;
  loading: boolean;
  error: string | null;
}

export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData>(getDefaultWeather());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getCurrentPosition()
      .then((position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude))
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setWeather(getDefaultWeather());
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { weather, loading, error };
}
