import { ChevronLeft, ChevronRight, Cloud, CloudRain, MapPin, Snowflake, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import { fetchWeatherByCity, PRESET_CITIES } from '../services/weatherService';
import type { WeatherData } from '../types';
import { SkeletonCard } from './SkeletonCard';

function weatherIcon(code: number) {
  if (code === 0 || code === 1) return <Sun className="w-12 h-12 text-yellow-500" />;
  if (code === 2 || code === 3) return <Cloud className="w-12 h-12 text-gray-500" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return <CloudRain className="w-12 h-12 text-blue-500" />;
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <Snowflake className="w-12 h-12 text-blue-300" />;
  }
  return <Sun className="w-12 h-12 text-yellow-500" />;
}

export function SideWeather() {
  const { weather, loading } = useWeather();
  const [cityIndex, setCityIndex] = useState<number | null>(null);
  const [cityWeather, setCityWeather] = useState<WeatherData | null>(null);
  const [cityLoading, setCityLoading] = useState(false);

  useEffect(() => {
    if (cityIndex === null) return;
    let cancelled = false;
    setCityLoading(true);
    fetchWeatherByCity(PRESET_CITIES[cityIndex])
      .then((data) => {
        if (!cancelled) {
          setCityWeather(data);
          setCityLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCityLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cityIndex]);

  const step = (delta: number) => {
    setCityIndex((current) => {
      const base = current === null ? (delta > 0 ? -1 : 0) : current;
      return (base + delta + PRESET_CITIES.length) % PRESET_CITIES.length;
    });
  };

  const displayed = cityWeather ?? weather;
  const isLoading = loading || (cityLoading && !cityWeather);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gn-border p-4 mb-6">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gn-border p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
          <MapPin className="w-4 h-4 text-gn-gray" />
          {cityWeather ? `${displayed.location} weather` : 'Your local weather'}
        </div>
        <div className="flex gap-1">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Previous location"
            onClick={() => step(-1)}
          >
            <ChevronLeft className="w-4 h-4 text-gn-gray" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Next location"
            onClick={() => step(1)}
          >
            <ChevronRight className="w-4 h-4 text-gn-gray" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {weatherIcon(displayed.weatherCode)}
        <div>
          <div className="text-3xl font-normal text-gray-900">
            {Math.round(displayed.temperature)}°C
          </div>
          <div className="text-sm text-gn-gray">{displayed.location}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <a
          href="https://www.google.com/search?q=weather"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gn-blue hover:underline"
        >
          Google Weather
        </a>
      </div>
    </div>
  );
}
