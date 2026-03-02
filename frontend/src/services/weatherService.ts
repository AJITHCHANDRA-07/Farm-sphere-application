import axios from 'axios';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
}

class WeatherService {
  private apiKey: string;
  private baseUrl: string = 'https://api.weatherapi.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_WEATHER_API_KEY || '';
    
    // Add debug logging
    console.log('🔧 Weather Service initialized');
    console.log('📡 WeatherAPI.com API Key:', this.apiKey ? 'Present' : 'MISSING');
    console.log('🔗 Base URL:', this.baseUrl);
    
    if (!this.apiKey) {
      console.warn('⚠️ WeatherAPI.com API key is missing. Weather functionality will be limited.');
    }
  }

  // Get user's current location using browser geolocation
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      console.log('📍 Requesting GPS location...');
      console.log('🌐 Browser GPS support:', navigator.geolocation ? 'Available' : 'Not Available');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('✅ GPS coordinates obtained:', { latitude, longitude });
          
          try {
            // Use WeatherAPI.com for reverse geocoding
            const response = await axios.get(
              `${this.baseUrl}/reverse.json`,
              {
                params: {
                  key: this.apiKey,
                  q: `${latitude},${longitude}`
                }
              }
            );

            const location = response.data.locations[0];
            console.log('✅ Location name resolved:', location);
            
            resolve({
              latitude,
              longitude,
              city: location.name || 'Unknown',
              state: location.region || 'Unknown',
              country: location.country || 'Unknown'
            });
          } catch (error) {
            console.error('❌ Reverse geocoding failed:', error);
            // Still resolve with coordinates even if reverse geocoding fails
            resolve({
              latitude,
              longitude,
              city: 'Unknown',
              state: 'Unknown',
              country: 'Unknown'
            });
          }
        },
        (error) => {
          console.error('❌ GPS access error:', error);
          console.error('❌ GPS error code:', error.code);
          console.error('❌ GPS error message:', error.message);
          
          let errorMessage = 'Failed to get GPS location';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please allow location access in your browser.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Get weather data by coordinates using WeatherAPI.com
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      console.log(`🌤️ Fetching weather for coordinates: ${lat}, ${lon}`);
      
      if (!this.apiKey) {
        throw new Error('WeatherAPI.com API key is missing');
      }

      const response = await axios.get(`${this.baseUrl}/current.json`, {
        params: {
          key: this.apiKey,
          q: `${lat},${lon}`,
          aqi: 'no'
        }
      });

      const data = response.data;
      console.log('✅ Weather API response:', data);
      
      return {
        location: `${data.location.name}, ${data.location.country}`,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text.toLowerCase(),
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph / 3.6, // Convert kph to m/s
        icon: data.current.condition.icon,
        feelsLike: Math.round(data.current.feelslike_c),
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km,
        uvIndex: data.current.uv
      };
    } catch (error) {
      console.error('❌ Weather API error:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ API Response:', error.response?.data);
        console.error('❌ API Status:', error.response?.status);
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  // Get weather data by city name using WeatherAPI.com
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      console.log(`🌤️ Fetching weather for city: ${city}`);
      
      if (!this.apiKey) {
        throw new Error('WeatherAPI.com API key is missing');
      }

      const response = await axios.get(`${this.baseUrl}/current.json`, {
        params: {
          key: this.apiKey,
          q: city,
          aqi: 'no'
        }
      });

      const data = response.data;
      console.log('✅ Weather API response for city:', data);
      
      return {
        location: `${data.location.name}, ${data.location.country}`,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text.toLowerCase(),
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph / 3.6, // Convert kph to m/s
        icon: data.current.condition.icon,
        feelsLike: Math.round(data.current.feelslike_c),
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km,
        uvIndex: data.current.uv
      };
    } catch (error) {
      console.error('❌ Weather API error for city:', error);
      if (axios.isAxiosError(error)) {
        console.error('❌ API Response:', error.response?.data);
        console.error('❌ API Status:', error.response?.status);
      }
      throw new Error('Failed to fetch weather data for city');
    }
  }

  // Get weather with user's current location
  async getCurrentWeather(): Promise<WeatherData> {
    try {
      console.log('🌍 Getting current weather for user location...');
      const location = await this.getCurrentLocation();
      console.log('📍 Location obtained:', location);
      return await this.getWeatherByCoordinates(location.latitude, location.longitude);
    } catch (error) {
      console.error('❌ Geolocation failed completely:', error);
      console.error('❌ Error details:', error.message);
      
      // Don't fallback to Delhi - throw the error so user knows
      throw new Error('Failed to get your location. Please enable location access in your browser.');
    }
  }

  // Get weather icon URL
  getWeatherIconUrl(iconCode: string): string {
    // WeatherAPI.com provides full URLs
    return iconCode.startsWith('http') ? iconCode : `https:${iconCode}`;
  }

  // Get weather emoji for simple display
  getWeatherEmoji(condition: string): string {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return '☀️';
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
      return '☁️';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return '🌧️';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return '⛈️';
    } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
      return '❄️';
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog') || conditionLower.includes('haze')) {
      return '🌫️';
    } else if (conditionLower.includes('wind')) {
      return '💨';
    } else {
      return '🌦️';
    }
  }
}

export const weatherService = new WeatherService();
