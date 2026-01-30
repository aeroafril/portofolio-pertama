"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface CurrentWeather {
  time: string;
  temperature: number;
  weather_desc: string;
  humidity: number;
  location: string;
  icon: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [minimized, setMinimized] = useState(true);

  useEffect(() => {
    fetchCurrentWeather();
  }, []);

  const fetchCurrentWeather = async () => {
    try {
      const response = await fetch("/api/cuaca", { cache: "no-store" });
      const result = await response.json();

      if (result.lokasi && result.data) {
        const allWeather: any[] = [];
        result.data.forEach((dayData: any) => {
          dayData.cuaca.forEach((timeSlots: any[]) => {
            allWeather.push(...timeSlots);
          });
        });

        const now = new Date();
        let closestWeather = allWeather[0];
        let minDiff = Math.abs(
          new Date(allWeather[0].datetime).getTime() - now.getTime()
        );

        allWeather.forEach((item) => {
          const diff = Math.abs(
            new Date(item.datetime).getTime() - now.getTime()
          );
          if (diff < minDiff) {
            minDiff = diff;
            closestWeather = item;
          }
        });

        setWeather({
          time: new Date(closestWeather.datetime).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: closestWeather.t,
          weather_desc: closestWeather.weather_desc,
          humidity: closestWeather.hu,
          location: `${result.lokasi.kecamatan}, ${result.lokasi.kotkab}`,
          icon: closestWeather.image,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Weather fetch error:", error);
      setLoading(false);
    }
  };

  const getWeatherEmoji = (desc: string) => {
    if (desc.includes("Cerah")) return "☀️";
    if (desc.includes("Berawan")) return "⛅";
    if (desc.includes("Hujan Ringan")) return "🌧️";
    if (desc.includes("Hujan Sedang") || desc.includes("Hujan Lebat"))
      return "⛈️";
    return "☁️";
  };

  if (minimized) {
    return (
      <div
        className="fixed bottom-6 right-6 bg-cyan-400/30 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer hover:bg-cyan-400/80 transition-all z-50"
        onClick={() => setMinimized(false)}
      >
        {getWeatherEmoji(weather?.weather_desc || "")}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed bottom-6 right-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border-2 border-white/10 w-72 animate-pulse z-50">
        <div className="h-20 bg-gray-700/50 rounded"></div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-950 to-gray-900 rounded-2xl shadow-2xl p-5 w-72 hover:shadow-3xl transition-all backdrop-blur-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Cuaca Sekarang</h3>
          <p className="text-xs text-gray-400">{weather.location}</p>
        </div>
        <span className="text-4xl">{getWeatherEmoji(weather.weather_desc)}</span>
      </div>

      <div className="mb-4">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-5xl font-bold text-white">
            {weather.temperature}°
          </span>
          <span className="text-gray-400 mb-2">C</span>
        </div>
        <p className="text-sm text-gray-300 font-medium">{weather.weather_desc}</p>
      </div>

      <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
        <div className="text-center">
          <p className="text-xs text-gray-400">Kelembaban</p>
          <p className="text-lg font-bold text-cyan-400">{weather.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Prakiraan</p>
          <p className="text-lg font-bold text-cyan-400">{weather.time}</p>
        </div>
      </div>

      <Link
        href="/cuaca"
        className="block w-full bg-orange-500 hover:bg-white/60 hover:text-blue-950 text-white text-center py-2.5 rounded-2xl font-semibold transition-all transform hover:scale-105"
      >
        Lihat Detail Prakiraan
      </Link>

      {/* Tombol minimize */}
      <button
        onClick={() => setMinimized(true)}
        className="absolute top-2  right-2 text-gray-400 hover:text-cyan-400 transition-colors text-xl"
        aria-label="Minimize"
      >
       <img 
       src="/minimize.png" 
       alt="minimize" 
       className="w-5 h-5 brightness-0 invert"
       />
      </button>
    </div>
  );
}