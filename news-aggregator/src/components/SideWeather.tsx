import {
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
import type { ChangeEvent } from 'react';
import { useWeather } from '../hooks/useWeather';
import { fetchWeatherByCity, PRESET_CITIES, weatherLabel } from '../services/weatherService';
import type { WeatherData } from '../types';
import { SkeletonCard } from './SkeletonCard';

const CITY_STORAGE_KEY = 'gn-weather-city';

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

/** 温度固定按摄氏度展示 */
function formatTemp(celsius: number): string {
  return `${Math.round(celsius)}°`;
}

function readStoredCity(): string {
  try {
    const stored = localStorage.getItem(CITY_STORAGE_KEY);
    return stored && PRESET_CITIES.some((city) => city.name === stored) ? stored : '';
  } catch {
    return '';
  }
}

export function SideWeather() {
  const { weather, loading } = useWeather();
  const [selectedCity, setSelectedCity] = useState<string>(readStoredCity);
  const [cityWeather, setCityWeather] = useState<WeatherData | null>(null);
  const [cityLoading, setCityLoading] = useState(false);

  useEffect(() => {
    const city = PRESET_CITIES.find((item) => item.name === selectedCity);
    if (!city) {
      setCityWeather(null);
      setCityLoading(false);
      return;
    }
    let cancelled = false;
    setCityWeather(null);
    setCityLoading(true);
    fetchWeatherByCity(city)
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
  }, [selectedCity]);

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCity(value);
    try {
      localStorage.setItem(CITY_STORAGE_KEY, value);
    } catch {
      // 隐私模式等场景下静默失败
    }
  };

  const displayed = cityWeather ?? weather;
  const isLoading = selectedCity ? cityLoading && !cityWeather : loading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gn-border p-4 mb-6">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gn-border p-4 mb-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 shrink-0">
          <MapPin className="w-4 h-4 text-gn-gray" />
          {selectedCity ? `${displayed.location}天气` : '本地天气'}
        </div>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          aria-label="选择城市"
          className="text-sm rounded border border-gn-border px-2 py-1 text-gray-700 bg-white max-w-[9rem] focus:outline-none focus:border-gn-blue"
        >
          <option value="">自动定位</option>
          {PRESET_CITIES.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        {weatherIcon(displayed.weatherCode, displayed.isDay)}
        <div>
          <div className="text-3xl font-normal text-gray-900">
            {formatTemp(displayed.temperature)}
            <span className="text-lg text-gn-gray">C</span>
          </div>
          <div className="text-sm text-gray-700">{weatherLabel(displayed.weatherCode)}</div>
          <div className="text-sm text-gn-gray">{displayed.location}</div>
        </div>
      </div>

      {/* 最高最低 / 体感 / 湿度 / 风速 */}
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gn-gray">
        {displayed.tempMax !== undefined && displayed.tempMin !== undefined && (
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5" />
            <span>
              最高 {formatTemp(displayed.tempMax)} / 最低 {formatTemp(displayed.tempMin)}
            </span>
          </div>
        )}
        {displayed.feelsLike !== undefined && (
          <div className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5" />
            <span>体感 {formatTemp(displayed.feelsLike)}</span>
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
