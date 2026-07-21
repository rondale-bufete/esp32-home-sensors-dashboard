"use client";

import { useState, useEffect } from "react";
import { getOutdoorWeather } from "@/lib/weather";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export default function OutdoorCard() {
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
            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-[#A29E97] mb-1">Outdoor</p>
                <p className="text-sm text-[#6E6A64]">Unavailable</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-[#A29E97] mb-1">Outdoor</p>
                {weather && <span className="text-lg">{weather.icon}</span>}
            </div>
            {weather ? (
                <>
                    <p className="text-2xl sm:text-4xl font-semibold font-[family-name:var(--font-display)] text-[#F4F3F1]">
                        {weather.temperature.toFixed(1)}°C
                    </p>
                    <p className="text-xs text-[#6E6A64] mt-1">{weather.humidity.toFixed(0)}% humidity</p>
                </>
            ) : (
                <div className="h-8 sm:h-10 w-20 bg-white/[0.06] rounded animate-pulse" />
            )}
        </div>
    );
}