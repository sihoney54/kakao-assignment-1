"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TodosError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Unhandled Todo App Error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6 shadow-inner animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
        문제가 발생했습니다!
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm max-w-sm">
        데이터를 불러오거나 처리하는 도중 서버 오류가 발생했거나 네트워크에 문제가 있습니다.
        {error.message && (
          <span className="block mt-2 font-mono text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded text-red-500 overflow-x-auto">
            {error.message}
          </span>
        )}
      </p>

      <div className="flex space-x-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition duration-200 cursor-pointer text-sm"
        >
          다시 시도
        </button>
        <a
          href="/todos"
          className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition duration-200 text-sm"
        >
          목록으로 이동
        </a>
      </div>
    </div>
  );
}
