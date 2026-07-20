"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function HistoryChart({ readings }) {
    const chartData = [...readings]
        .reverse()
        .map((r) => ({
            time: new Date(r.created_at).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
            }),
            temperature: r.temperature,
            humidity: r.humidity,
        }));

    return (
        <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-3 sm:p-6">
            <h2 className="text-sm font-medium text-[#A29E97] mb-4 px-1">History</h2>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="time" stroke="#6E6A64" fontSize={10} interval="preserveStartEnd" />
                    <YAxis stroke="#6E6A64" fontSize={10} width={30} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#1C1B1E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                        labelStyle={{ color: "#F4F3F1" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#818CF8" strokeWidth={2} dot={false} name="Temp (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="#34D399" strokeWidth={2} dot={false} name="Humidity (%)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}