"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTodo } from "../../actions";

export default function NewTodoPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }

    startTransition(async () => {
      try {
        await createTodo({
          title: title.trim(),
          description: description.trim() || undefined,
        });
        router.push("/todos");
      } catch (err) {
        setError("Todo 생성에 실패했습니다. 다시 시도해 주세요.");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <Link
          href="/todos"
          className="text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1.5 transition duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>목록으로 돌아가기</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
          새 Todo 등록
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          오늘 할 일을 계획하고 추가해보세요.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6"
      >
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-200/50 dark:border-red-900/30 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
          >
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            placeholder="할 일의 제목을 입력하세요 (ex. 오늘 운동하기)"
            className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition duration-150 text-sm"
          />
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
          >
            상세 설명
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            placeholder="할 일에 대한 구체적인 설명을 남겨보세요."
            className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition duration-150 text-sm resize-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <Link
            href="/todos"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition duration-200 text-sm"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-500/80 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition duration-200 text-sm cursor-pointer flex items-center space-x-2"
          >
            {isPending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>등록 중...</span>
              </>
            ) : (
              <span>등록하기</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
