"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";
import StatCards from "./StatCards";
import HistoryChart from "./HistoryChart";
import OfflineBanner from "./OfflineBanner";
import OutdoorWeatherPanel from "./OutdoorWeatherPanel";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import DashboardSkeleton from "./DashboardSkeleton";

const OFFLINE_THRESHOLD_SECONDS = 90;

export default function Dashboard() {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const supabase = createBrowserSupabaseClient();

        async function loadInitial() {
            const { data, error } = await supabase
                .from("readings")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100);

            if (!error) setReadings(data);
            setLoading(false);
        }
        loadInitial();

        const channel = supabase
            .channel("readings-changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "readings" },
                (payload) => {
                    setReadings((prev) => [payload.new, ...prev].slice(0, 100));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const latest = readings[0];
    const secondsSinceLastReading = latest
        ? Math.floor((now - new Date(latest.created_at).getTime()) / 1000)
        : null;
    const isOffline = secondsSinceLastReading !== null && secondsSinceLastReading > OFFLINE_THRESHOLD_SECONDS;

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-8">
                <h1 className="text-xl sm:text-2xl font-medium font-[family-name:var(--font-display)] tracking-tight text-[#F4F3F1]">
                    Environment Monitor
                </h1>
                {latest && !isOffline && (
                    <p className="text-xs text-[#6E6A64]">
                        Last updated{" "}
                        {new Date(latest.created_at).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </p>
                )}
            </div>

            {isOffline && <OfflineBanner lastSeenSeconds={secondsSinceLastReading} />}

            <section className="mb-10">
                <p className="font-[family-name:var(--font-mono,monospace)] text-xs text-[#818CF8] uppercase tracking-wider mb-3">
                    Room
                </p>
                <StatCards latest={latest} stale={isOffline} />
                <HistoryChart readings={readings} />
            </section>

            <section>
                <p className="font-[family-name:var(--font-mono,monospace)] text-xs text-[#818CF8] uppercase tracking-wider mb-3">
                    Outside
                </p>
                <OutdoorWeatherPanel />
                <HourlyForecast />
                <DailyForecast />
            </section>
        </div>
    );
}