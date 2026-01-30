"use client"

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

// INTERFACE untuk TypeScript
interface WeatherData {
  datetime: string;
  t: number;
  tcc: number;
  tp: number;
  weather: number;
  weather_desc: string;
  weather_desc_en: string;
  wd_deg: number;
  wd: string;
  ws: number;
  hu: number;
  vs: number;
  image: string;
}

interface LocationData {
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lon: number;
  lat: number;
}

export default function KualitasUdara() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  // loading
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if(prev >= 90){
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Fetch data dari API route
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Auto-hide alert setelah 3 detik
  useEffect(() => {
    if (!loading && !error && weatherData.length > 0) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, error, weatherData.length]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cuaca', {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      
      const result = await response.json();
      
      if (result.lokasi && result.data) {
        setLocationData(result.lokasi);
        
        // Flatten semua cuaca data dari semua hari
        const allWeather: WeatherData[] = [];
        result.data.forEach((dayData: any) => {
          dayData.cuaca.forEach((timeSlots: WeatherData[]) => {
            allWeather.push(...timeSlots);
          });
        });
        
        setWeatherData(allWeather);
        setLastUpdated(new Date().toLocaleString('id-ID'));
      } else {
        throw new Error('Invalid data structure');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Gagal memuat data dari BMKG. Pastikan API route sudah benar.');
      setLoading(false);
    }
  };

  // Group weather by day
  const groupedByDay = weatherData.reduce((acc: { [key: string]: WeatherData[] }, item) => {
    const date = new Date(item.datetime).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const days = Object.keys(groupedByDay);
  const currentDayData = days[selectedDay] ? groupedByDay[days[selectedDay]] : [];

  const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode === 0 || weatherCode === 1) return '☀️';
    if (weatherCode === 2 || weatherCode === 3) return '⛅';
    if (weatherCode >= 61 && weatherCode <= 67) return '🌧️';
    if (weatherCode >= 80 && weatherCode <= 82) return '🌦️';
    return '☁️';
  };

  const getWeatherColor = (weatherDesc: string) => {
    if (weatherDesc.includes('Cerah')) return 'border-yellow-500/50 bg-yellow-500/10';
    if (weatherDesc.includes('Berawan')) return 'border-gray-500/50 bg-gray-500/10';
    if (weatherDesc.includes('Hujan Ringan')) return 'border-blue-500/50 bg-blue-500/10';
    if (weatherDesc.includes('Hujan Sedang') || weatherDesc.includes('Hujan Lebat')) return 'border-cyan-500/50 bg-cyan-500/10';
    return 'border-white/20 bg-white/5';
  };

  // loading
  if(loading){
    return(
      <div className='fixed inset-0 bg-blue-950 flex flex-col items-center justify-center z-50 gap-8'>
        <h3 className='text-4xl font-bold text-white items-center justify-center'>Loading...</h3>
        
        <div className='w-60 md:w-80 lg:w-100 flex flex-col items-center'>
          <div className='w-full h-2 bg-gray-500 rounded-full overflow-hidden'>
            <div className='h-full bg-white transition-all duration-300 ease-out' style={{width: `${progress}%`}}></div>
          </div>
          <p className='mt-4 text-white font-medium'>{progress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="libre-franklin-regular min-h-screen bg-gradient-to-b from-blue-950 via-gray-800 to-gray-900">
      {/* Header */}
      <nav className="bg-blue-950 border-b border-white/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Prakiraan Cuaca
            </h1>
            {lastUpdated && (
              <p className="text-xs text-gray-400 mt-1">Last updated: {lastUpdated}</p>
            )}
          </div>
            <Link 
              href="/" 
              className="text-sm md:text-base text-white hover:text-cyan-400 transition-colors font-medium flex items-center gap-2"
            >
              <img
                src="/fast-forward-double-right-arrows-symbol.png"
                alt="arrow"
                className="w-3 h-3 brightness-0 invert rotate-180"
              />
              <span>Back to Portfolio</span>
            </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Title & Location */}
        <div className="text-center mb-8">
          <h1 className="bungee-regular text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
            Prakiraan Cuaca BMKG
          </h1>
          {locationData && (
            <div className="mt-4">
              <p className="text-xl font-semibold text-white">{locationData.desa}, {locationData.kecamatan}</p>
              <p className="text-gray-300">{locationData.kotkab}, {locationData.provinsi}</p>
              <p className="text-sm text-gray-400 mt-2">
                {locationData.lat.toFixed(4)}°, {locationData.lon.toFixed(4)}°
              </p>
            </div>
          )}
          <p className="text-sm text-gray-400 mt-3">Data dari BMKG API</p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={fetchWeatherData}
            disabled={loading}
            className="px-6 py-2 bg-orange-500 text-white rounded-2xl hover:bg-white/60 hover:text-blue-950 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Info Alert - Auto Hide */}
        {showAlert && !loading && !error && weatherData.length > 0 && (
          <div className="bg-cyan-500 text-white rounded-lg p-3 mb-6 text-sm font-medium transition-opacity duration-500">
            ✓ Data berhasil dimuat! Menampilkan {weatherData.length} prakiraan cuaca.
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
            <p className="text-white mt-4 font-medium">Mengambil data dari BMKG...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-medium mb-4">⚠️ {error}</p>
            <button
              onClick={fetchWeatherData}
              className="px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Day Selector */}
        {!loading && !error && days.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 rounded-2xl font-medium transition-all whitespace-nowrap text-sm ${
                  selectedDay === index
                    ? 'bg-cyan-400 text-blue-950'
                    : 'bg-white/5 border-2 border-white/10 text-white hover:border-cyan-400'
                }`}
              >
                {day.split(',')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Weather Cards Grid */}
        {!loading && !error && currentDayData.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDayData.map((item, index) => {
              const time = new Date(item.datetime).toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              
              return (
                <div
                  key={index}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all p-6 border-2 ${getWeatherColor(item.weather_desc)}`}
                >
                  {/* Time & Weather Icon */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{time}</h3>
                      <p className="text-sm text-gray-300 mt-1">{item.weather_desc}</p>
                    </div>
                    <span className="text-4xl">{getWeatherIcon(item.weather)}</span>
                  </div>

                  {/* Temperature */}
                  <div className="mb-4">
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-bold text-white">{item.t}°</span>
                      <span className="text-gray-400 mb-2 text-lg">C</span>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Kelembaban</p>
                      <p className="text-lg font-semibold text-cyan-400">{item.hu}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Angin</p>
                      <p className="text-lg font-semibold text-cyan-400">{item.ws} km/h</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Curah Hujan</p>
                      <p className="text-lg font-semibold text-cyan-400">{item.tp} mm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Awan</p>
                      <p className="text-lg font-semibold text-cyan-400">{item.tcc}%</p>
                    </div>
                  </div>

                  {/* Wind Direction */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500">
                      Arah Angin: {item.wd} ({item.wd_deg}°) • Jarak Pandang: {(item.vs / 1000).toFixed(1)} km
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Data */}
        {!loading && !error && weatherData.length === 0 && (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-md">
            <p className="text-gray-400 text-lg">Tidak ada data yang tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}
