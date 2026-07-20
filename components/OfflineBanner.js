export default function OfflineBanner({ lastSeenSeconds }) {
    const minutes = Math.floor(lastSeenSeconds / 60);
    const seconds = lastSeenSeconds % 60;

    const timeText =
        minutes > 0 ? `${minutes}m ${seconds}s ago` : `${seconds}s ago`;

    return (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 mb-6">            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <p className="text-sm text-red-300">
                Sensor offline — last reading received {timeText}
            </p>
        </div>
    );
}