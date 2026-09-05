import type { WeatherData } from '../types';

export interface OpenMeteoCurrentWeather {
  temperature: number;
  weathercode: number;
  is_day: number;
}

export interface OpenMeteoResponse {
  current_weather: OpenMeteoCurrentWeather;
}

export interface PresetCity {
  name: string;
  latitude: number;
  longitude: number;
}

export const PRESET_CITIES: PresetCity[] = [
  { name: 'Beijing', latitude: 39.9042, longitude: 116.4074 },
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
};

async function fetchWeather(latitude: number, longitude: number, location: string): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  const data = (await response.json()) as OpenMeteoResponse;
  return {
    location,
    temperature: data.current_weather.temperature,
    weatherCode: data.current_weather.weathercode,
    isDay: data.current_weather.is_day === 1,
  };
}

export async function fetchWeatherByCoords(latitude: number, longitude: number): Promise<WeatherData> {
  return fetchWeather(latitude, longitude, `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
}

export async function fetchWeatherByCity(city: PresetCity): Promise<WeatherData> {
  return fetchWeather(city.latitude, city.longitude, city.name);
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
