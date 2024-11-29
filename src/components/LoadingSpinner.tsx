export default function LoadingSpinner() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Skeletons */}
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="bg-white rounded-lg shadow p-6 space-y-3"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Additional Content Skeleton */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
} 