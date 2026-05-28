import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Section cards */}
          <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          {/* Chart */}
          <div className="px-4 lg:px-6">
            <Skeleton className="h-64 rounded-xl" />
          </div>
          {/* Table */}
          <div className="px-4 lg:px-6">
            <Skeleton className="mb-3 h-10 rounded-xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
