import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  MapPin,
  Moon,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import { fetchWeatherByCity, PRESET_CITIES, weatherLabel } from '../services/weatherService';
import type { WeatherData } from '../types';
import { SkeletonCard } from './SkeletonCard';

function weatherIcon(code: number, isDay: boolean) {
  const cls = 'w-12 h-12';
  if (code === 0 || code === 1) {
    return isDay ? <Sun className={`${cls} text-yellow-500`} /> : <Moon className={`${cls} text-indigo-400`} />;
  }
  if (code === 2 || code === 3) return <Cloud className={`${cls} text-gray-500`} />;
  if (code === 45 || code === 48) return <CloudFog className={`${cls} text-gray-400`} />;
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return <CloudRain className={`${cls} text-blue-500`} />;
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <CloudSnow className={`${cls} text-blue-300`} />;
  }
  if ([95, 96, 99].includes(code)) return <CloudLightning className={`${cls} text-amber-500`} />;
  return <Sun className={`${cls} text-yellow-500`} />;
}

type Unit = 'c' | 'f';

function displayTemp(celsius: number, unit: Unit): string {
  const value = unit === 'c' ? celsius : celsius * 1.8 + 32;
  return `${Math.round(value)}°`;
}

export function SideWeather() {
  const { weather, loading } = useWeather();
  const [cityIndex, setCityIndex] = useState<number | null>(null);
  const [cityWeather, setCityWeather] = useState<WeatherData | null>(null);
  const [cityLoading, setCityLoading] = useState(false);
  const [unit, setUnit] = useState<Unit>('c');

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
          {cityWeather ? `${displayed.location}天气` : '本地天气'}
        </div>
        <div className="flex items-center gap-1">
          {/* °C / °F 切换 */}
          <div className="flex text-xs font-medium border border-gn-border rounded-full overflow-hidden mr-1">
            <button
              onClick={() => setUnit('c')}
              className={`px-2 py-0.5 transition-colors ${unit === 'c' ? 'bg-gn-blue text-white' : 'text-gn-gray hover:bg-gray-100'}`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('f')}
              className={`px-2 py-0.5 transition-colors ${unit === 'f' ? 'bg-gn-blue text-white' : 'text-gn-gray hover:bg-gray-100'}`}
            >
              °F
            </button>
          </div>
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="上一个地点"
            onClick={() => step(-1)}
          >
            <ChevronLeft className="w-4 h-4 text-gn-gray" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="下一个地点"
            onClick={() => step(1)}
          >
            <ChevronRight className="w-4 h-4 text-gn-gray" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {weatherIcon(displayed.weatherCode, displayed.isDay)}
        <div>
          <div className="text-3xl font-normal text-gray-900">
            {displayTemp(displayed.temperature, unit)}
            <span className="text-lg text-gn-gray">{unit === 'c' ? 'C' : 'F'}</span>
          </div>
          <div className="text-sm text-gray-700">{weatherLabel(displayed.weatherCode)}</div>
          <div className="text-sm text-gn-gray">{displayed.location}</div>
        </div>
      </div>

      {/* 高低温 / 体感 / 湿度 / 风速 */}
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gn-gray">
        {displayed.tempMax !== undefined && displayed.tempMin !== undefined && (
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5" />
            <span>
              最高 {displayTemp(displayed.tempMax, unit)} / 最低 {displayTemp(displayed.tempMin, unit)}
            </span>
          </div>
        )}
        {displayed.feelsLike !== undefined && (
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5" />
            <span>体感 {displayTemp(displayed.feelsLike, unit)}</span>
          </div>
        )}
        {displayed.humidity !== undefined && (
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5" />
            <span>湿度 {displayed.humidity}%</span>
          </div>
        )}
        {displayed.windSpeed !== undefined && (
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5" />
            <span>风速 {Math.round(displayed.windSpeed)} km/h</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <a
          href="https://www.weather.com.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gn-blue hover:underline"
        >
          查看详细天气
        </a>
      </div>
    </div>
  );
}
