export default function StatCards({ latest, stale }) {
    if (!latest) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-5 sm:p-6">
                    <p className="text-sm text-[#A29E97]">Waiting for first reading...</p>
                </div>
                <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-5 sm:p-6">
                    <p className="text-sm text-[#A29E97]">Waiting for first reading...</p>
                </div>
            </div>
        );
    }

    const humidityWarning = !stale && (latest.humidity > 70 || latest.humidity < 30);
    const tempWarning = !stale && latest.temperature > 30;

    return (
        <div className={`grid grid-cols-2 gap-3 sm:gap-4 mb-6 transition-opacity ${stale ? "opacity-50" : "opacity-100"}`}>
            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs sm:text-sm text-[#A29E97]">Temperature</p>
                    <span className="text-base">🌡️</span>
                </div>
                <p className={`text-3xl sm:text-5xl font-semibold font-[family-name:var(--font-display)] ${tempWarning ? "text-amber-400" : "text-[#F4F3F1]"}`}>
                    {latest.temperature.toFixed(1)}°
                </p>
                {tempWarning && <p className="text-xs text-amber-400 mt-1.5">Above comfortable range</p>}
            </div>

            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs sm:text-sm text-[#A29E97]">Humidity</p>
                    <span className="text-base">💧</span>
                </div>
                <p className={`text-3xl sm:text-5xl font-semibold font-[family-name:var(--font-display)] ${humidityWarning ? "text-amber-400" : "text-[#F4F3F1]"}`}>
                    {latest.humidity.toFixed(1)}%
                </p>
                {humidityWarning && <p className="text-xs text-amber-400 mt-1.5">Outside 30-70% range</p>}
            </div>
        </div>
    );
}