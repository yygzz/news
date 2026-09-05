import type { WeatherData } from '../types';

export interface OpenMeteoCurrentWeather {
  temperature: number;
  weathercode: number;
  is_day: number;
}

export interface OpenMeteoResponse {
  current_weather: OpenMeteoCurrentWeather;
}

const MOCK_WEATHER: WeatherData = {
  location: 'Beijing',
  temperature: 26,
  weatherCode: 0,
  isDay: true,
};

export async function fetchWeatherByCoords(latitude: number, longitude: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  const data = (await response.json()) as OpenMeteoResponse;
  return {
    location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
    temperature: data.current_weather.temperature,
    weatherCode: data.current_weather.weathercode,
    isDay: data.current_weather.is_day === 1,
  };
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
