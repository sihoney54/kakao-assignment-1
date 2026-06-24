export default function TodosLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8 animate-pulse">
        <div>
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
        </div>
        <div className="h-10 w-28 bg-indigo-200 dark:bg-indigo-900 rounded-lg"></div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="space-y-4 mb-6 animate-pulse">
        <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
        <div className="flex space-x-2">
          <div className="h-9 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-9 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-9 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
      </div>

      {/* Todo Items Skeletons */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm animate-pulse"
          >
            <div className="flex items-center space-x-4 w-2/3">
              <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
              <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
