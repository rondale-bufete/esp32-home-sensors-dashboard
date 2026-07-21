"use client";

import { useState, useEffect, useMemo } from "react";
import { getOutdoorWeather } from "@/lib/weather";

export default function DailyForecast() {
    const [daily, setDaily] = useState(null);

    useEffect(() => {
        getOutdoorWeather()
            .then((data) => setDaily(data.daily))
            .catch(() => setDaily([]));
    }, []);

    const { weekMin, weekMax } = useMemo(() => {
        if (!daily || daily.length === 0) return { weekMin: 0, weekMax: 1 };
        const mins = daily.map((d) => d.tempMin);
        const maxs = daily.map((d) => d.tempMax);
        return { weekMin: Math.min(...mins), weekMax: Math.max(...maxs) };
    }, [daily]);

    if (daily === null) {
        return (
            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-4 sm:p-6 animate-pulse">
                <div className="h-4 w-24 bg-white/[0.06] rounded mb-4" />
                <div className="h-40 w-full bg-white/[0.04] rounded" />
            </div>
        );
    }

    if (daily.length === 0) return null;

    const range = weekMax - weekMin || 1;

    return (
        <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-3 sm:p-6">
            <p className="text-sm font-medium text-[#A29E97] mb-1 px-1 sm:px-0">7-Day Outlook</p>
            <p className="text-xs text-[#6E6A64] mb-3 sm:mb-4 px-1 sm:px-0">
                {weekMin.toFixed(0)}° – {weekMax.toFixed(0)}° this week
            </p>

            <div className="divide-y divide-white/[0.05]">
                {daily.map((d, i) => {
                    const isToday = i === 0;
                    const barStart = ((d.tempMin - weekMin) / range) * 100;
                    const barWidth = ((d.tempMax - d.tempMin) / range) * 100;

                    return (
                        <div
                            key={d.date}
                            className={`flex items-center gap-2 sm:gap-4 py-2.5 sm:py-3 px-1.5 sm:px-2 -mx-1.5 sm:-mx-2 rounded-lg transition-colors ${isToday ? "bg-[#818CF8]/[0.06]" : "hover:bg-white/[0.02]"
                                }`}
                        >
                            <div className="w-10 sm:w-16 shrink-0">
                                <p className={`text-xs sm:text-sm ${isToday ? "text-[#818CF8] font-medium" : "text-[#F4F3F1]"}`}>
                                    {isToday
                                        ? "Today"
                                        : new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}
                                </p>
                                <p className="hidden sm:block text-[10px] text-[#6E6A64]">
                                    {new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                </p>
                            </div>

                            <span className="text-lg sm:text-xl shrink-0" title={d.condition}>
                                {d.icon}
                            </span>

                            <div className="w-7 sm:w-8 shrink-0 text-center hidden xs:block">
                                {d.precipitationProbability > 0 ? (
                                    <p className="text-[10px] sm:text-[11px] text-blue-300">{d.precipitationProbability}%</p>
                                ) : (
                                    <p className="text-[10px] sm:text-[11px] text-transparent">0%</p>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                                <span className="text-xs text-[#6E6A64] w-6 sm:w-7 text-right shrink-0">
                                    {Math.round(d.tempMin)}°
                                </span>
                                <div className="relative flex-1 h-1.5 rounded-full bg-white/[0.06] min-w-[30px]">
                                    <div
                                        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-amber-400"
                                        style={{ left: `${barStart}%`, width: `${barWidth}%` }}
                                    />
                                </div>
                                <span className="text-xs text-[#F4F3F1] font-medium w-6 sm:w-7 shrink-0">
                                    {Math.round(d.tempMax)}°
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}