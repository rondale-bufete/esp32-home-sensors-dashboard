"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";
import StatCards from "./StatCards";
import HistoryChart from "./HistoryChart";

export default function Dashboard() {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createBrowserSupabaseClient();

        // Initial load
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

        // Subscribe to new readings in real time
        const channel = supabase
            .channel("readings-changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "readings" },
                (payload) => {
                    console.log("Realtime event received:", payload);
                    setReadings((prev) => [payload.new, ...prev].slice(0, 100));
                }
            )
            .subscribe((status) => {
                console.log("Subscription status:", status);
            });

        // Cleanup: unsubscribe when the component unmounts
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const latest = readings[0];

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <p className="text-[#A29E97]">Loading readings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold font-[family-name:var(--font-display)] text-[#F4F3F1]">
                    Environment Monitor
                </h1>
                {latest && (
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

            <StatCards latest={latest} />
            <HistoryChart readings={readings} />
        </div>
    );
}