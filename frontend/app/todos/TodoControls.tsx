"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function TodoControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentFilter = searchParams.get("filter") || "all";
  const currentSearch = searchParams.get("search") || "";

  const [searchText, setSearchText] = useState(currentSearch);

  // Sync state with URL search parameters
  useEffect(() => {
    setSearchText(currentSearch);
  }, [currentSearch]);

  // Debounce search parameter update
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText !== currentSearch) {
        updateParams({ search: searchText || undefined });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText, currentSearch]);

  const updateParams = (newParams: { filter?: string; search?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update filter
    if (newParams.filter !== undefined) {
      if (newParams.filter === "all") {
        params.delete("filter");
      } else {
        params.set("filter", newParams.filter);
      }
    }

    // Update search
    if (newParams.search !== undefined) {
      params.set("search", newParams.search);
    } else if (newParams.search === undefined && searchText === "") {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="검색할 Todo를 입력하세요..."
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition duration-150 text-sm"
        />
        {isPending && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/50 rounded-xl max-w-xs">
        {[
          { key: "all", label: "전체" },
          { key: "active", label: "진행 중" },
          { key: "completed", label: "완료" },
        ].map((tab) => {
          const isActive = currentFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => updateParams({ filter: tab.key })}
              className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
