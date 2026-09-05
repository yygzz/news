import type { WeatherData } from '../types';

interface OpenMeteoCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  weather_code: number;
  wind_speed_10m: number;
}

interface OpenMeteoDaily {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

interface OpenMeteoResponse {
  current: OpenMeteoCurrent;
  daily?: OpenMeteoDaily;
}

export interface PresetCity {
  name: string;
  latitude: number;
  longitude: number;
}

export const PRESET_CITIES: PresetCity[] = [
  { name: 'Beijing', latitude: 39.9042, longitude: 116.4074 },
  { name: 'Shanghai', latitude: 31.2304, longitude: 121.4737 },
  { name: 'Shenzhen', latitude: 22.5431, longitude: 114.0579 },
  { name: 'Chengdu', latitude: 30.5728, longitude: 104.0668 },
  { name: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
];

const MOCK_WEATHER: WeatherData = {
  location: 'Beijing',
  temperature: 26,
  weatherCode: 0,
  isDay: true,
  feelsLike: 28,
  humidity: 45,
  windSpeed: 12,
  tempMax: 30,
  tempMin: 21,
};

const CACHE_PREFIX = 'gn-weather:';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 分钟

function readCache(key: string): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { time: number; data: WeatherData };
    if (Date.now() - parsed.time > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: WeatherData): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ time: Date.now(), data }));
  } catch {
    // 隐私模式等场景下静默失败
  }
}

/** WMO 天气代码 → 中文描述 */
export function weatherLabel(code: number): string {
  if (code === 0) return '晴';
  if (code === 1) return '大致晴朗';
  if (code === 2) return '局部多云';
  if (code === 3) return '阴';
  if (code === 45 || code === 48) return '雾';
  if ([51, 53, 55].includes(code)) return '毛毛雨';
  if ([56, 57].includes(code)) return '冻毛毛雨';
  if ([61, 63].includes(code)) return '小雨';
  if (code === 65) return '大雨';
  if ([66, 67].includes(code)) return '冻雨';
  if ([71, 73].includes(code)) return '小雪';
  if (code === 75) return '大雪';
  if (code === 77) return '雪粒';
  if ([80, 81].includes(code)) return '阵雨';
  if (code === 82) return '强阵雨';
  if ([85, 86].includes(code)) return '阵雪';
  if (code === 95) return '雷暴';
  if ([96, 99].includes(code)) return '雷暴伴冰雹';
  return '未知';
}

async function fetchWeather(latitude: number, longitude: number, location: string): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min',
    forecast_days: '1',
    timezone: 'auto',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  const data = (await response.json()) as OpenMeteoResponse;
  return {
    location,
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    tempMax: data.daily?.temperature_2m_max?.[0],
    tempMin: data.daily?.temperature_2m_min?.[0],
  };
}

/** 反向地理编码（BigDataCloud 免费客户端接口，无需 key），失败时回退到坐标文本 */
async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`
    );
    if (!response.ok) throw new Error(String(response.status));
    const data = (await response.json()) as { city?: string; locality?: string; principalSubdivision?: string };
    return data.city || data.locality || data.principalSubdivision || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  } catch {
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }
}

export async function fetchWeatherByCoords(latitude: number, longitude: number): Promise<WeatherData> {
  const key = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
  const cached = readCache(key);
  if (cached) return cached;
  const location = await reverseGeocode(latitude, longitude);
  const data = await fetchWeather(latitude, longitude, location);
  writeCache(key, data);
  return data;
}

export async function fetchWeatherByCity(city: PresetCity): Promise<WeatherData> {
  const cached = readCache(city.name);
  if (cached) return cached;
  const data = await fetchWeather(city.latitude, city.longitude, city.name);
  writeCache(city.name, data);
  return data;
}

export function getDefaultWeather(): WeatherData {
  return MOCK_WEATHER;
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 600000,
    });
  });
}
