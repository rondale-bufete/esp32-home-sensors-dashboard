export default function DashboardSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
                <div className="h-6 sm:h-7 w-48 bg-white/[0.06] rounded" />
                <div className="h-3 w-24 bg-white/[0.06] rounded" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-4 sm:p-6">
                    <div className="h-3 w-20 bg-white/[0.06] rounded mb-3" />
                    <div className="h-8 sm:h-10 w-24 bg-white/[0.08] rounded" />
                </div>
                <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-4 sm:p-6">
                    <div className="h-3 w-16 bg-white/[0.06] rounded mb-3" />
                    <div className="h-8 sm:h-10 w-20 bg-white/[0.08] rounded" />
                </div>
            </div>

            <div className="bg-[#1C1B1E] border border-white/[0.06] rounded-xl p-3 sm:p-6">
                <div className="h-3 w-16 bg-white/[0.06] rounded mb-4 ml-1" />
                <div className="h-[260px] w-full bg-white/[0.04] rounded-lg" />
            </div>
        </div>
    );
}