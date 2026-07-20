export default function StatCards({ latest, stale }) {
    if (!latest) {
        return (
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-6">
                    <p className="text-sm text-[#A29E97]">Waiting for first reading...</p>
                </div>
                <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-6">
                    <p className="text-sm text-[#A29E97]">Waiting for first reading...</p>
                </div>
            </div>
        );
    }

    const humidityWarning = !stale && (latest.humidity > 70 || latest.humidity < 30);
    const tempWarning = !stale && latest.temperature > 30;

    return (
        <div className={`grid grid-cols-2 gap-4 mb-8 transition-opacity ${stale ? "opacity-50" : "opacity-100"}`}>
            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-6">
                <p className="text-sm text-[#A29E97] mb-1">Temperature</p>
                <p className={`text-4xl font-semibold font-[family-name:var(--font-display)] ${tempWarning ? "text-amber-400" : "text-[#F4F3F1]"}`}>
                    {latest.temperature.toFixed(1)}°C
                </p>
                {tempWarning && <p className="text-xs text-amber-400 mt-1">Above comfortable range</p>}
            </div>

            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-6">
                <p className="text-sm text-[#A29E97] mb-1">Humidity</p>
                <p className={`text-4xl font-semibold font-[family-name:var(--font-display)] ${humidityWarning ? "text-amber-400" : "text-[#F4F3F1]"}`}>
                    {latest.humidity.toFixed(1)}%
                </p>
                {humidityWarning && <p className="text-xs text-amber-400 mt-1">Outside 30-70% range</p>}
            </div>
        </div>
    );
}