"use client";

import { useState, useEffect } from "react";
import { getOutdoorWeather } from "@/lib/weather";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export default function OutdoorWeatherPanel() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await getOutdoorWeather();
                setWeather(data.current);
                setError(false);
            } catch (err) {
                setError(true);
            }
        }

        load();
        const interval = setInterval(load, REFRESH_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-5 sm:p-6 mb-4">
                <p className="text-sm text-[#A29E97]">Outdoor weather unavailable</p>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-5 sm:p-6 mb-4 animate-pulse">
                <div className="h-4 w-40 bg-white/[0.06] rounded mb-4" />
                <div className="h-10 w-24 bg-white/[0.08] rounded" />
            </div>
        );
    }

    const localTime = new Date(weather.time).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-5 sm:p-6 mb-4">
            <div className="flex items-start justify-between mb-5">
                <div>
                    <p className="text-sm text-[#F4F3F1] font-medium">{weather.locationName}</p>
                    <p className="text-xs text-[#6E6A64] mt-0.5">
                        {weather.timezoneAbbreviation} · Updated {localTime}
                    </p>
                </div>
                <span className="text-3xl" title={weather.condition}>
                    {weather.icon}
                </span>
            </div>

            <div className="flex items-baseline gap-2">
                <p className="text-4xl sm:text-5xl font-semibold font-[family-name:var(--font-display)] text-[#F4F3F1]">
                    {weather.temperature.toFixed(1)}°
                </p>
                <p className="text-sm text-[#A29E97]">{weather.condition}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/[0.06] text-center">
                <div>
                    <p className="text-xs text-[#6E6A64]">Feels like</p>
                    <p className="text-sm font-medium text-[#F4F3F1] mt-1">
                        {weather.apparentTemperature.toFixed(1)}°
                    </p>
                </div>
                <div>
                    <p className="text-xs text-[#6E6A64]">Humidity</p>
                    <p className="text-sm font-medium text-[#F4F3F1] mt-1">
                        {weather.humidity.toFixed(0)}%
                    </p>
                </div>
                <div>
                    <p className="text-xs text-[#6E6A64]">Wind</p>
                    <p className="text-sm font-medium text-[#F4F3F1] mt-1">
                        {weather.windSpeed.toFixed(1)} km/h
                    </p>
                </div>
            </div>
        </div>
    );
}