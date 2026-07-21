"use client";

import { useState, useEffect } from "react";
import { getOutdoorWeather } from "@/lib/weather";

export default function HourlyForecast() {
    const [hourly, setHourly] = useState(null);

    useEffect(() => {
        getOutdoorWeather()
            .then((data) => setHourly(data.hourly))
            .catch(() => setHourly([]));
    }, []);

    if (hourly === null) {
        return (
            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-4 sm:p-6 mb-8 animate-pulse">
                <div className="h-4 w-32 bg-white/[0.06] rounded mb-4" />
                <div className="h-16 w-full bg-white/[0.04] rounded" />
            </div>
        );
    }

    if (hourly.length === 0) return null;

    return (
        <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-4 sm:p-6 mb-4">            <p className="text-sm font-medium text-[#A29E97] mb-4">Next Hours</p>
            <div className="flex justify-between gap-2 overflow-x-auto">
                {hourly.map((h, i) => (
                    <div key={h.time} className="flex flex-col items-center gap-1.5 shrink-0 px-2">
                        <p className="text-xs text-[#6E6A64]">
                            {i === 0
                                ? "Now"
                                : new Date(h.time).toLocaleTimeString(undefined, { hour: "numeric" })}
                        </p>
                        <span className="text-xl">{h.icon}</span>
                        <p className="text-sm font-medium text-[#F4F3F1]">{Math.round(h.temperature)}°</p>
                        {h.precipitationProbability > 0 && (
                            <p className="text-[10px] text-blue-300">{h.precipitationProbability}%</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}