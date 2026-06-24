"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Todo, updateTodo } from "../../actions";

interface EditTodoFormProps {
  todo: Todo;
}

export default function EditTodoForm({ todo }: EditTodoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [completed, setCompleted] = useState(todo.completed);
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
        await updateTodo(todo.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          completed,
        });
        router.push("/todos");
      } catch (err) {
        setError("Todo 수정에 실패했습니다. 다시 시도해 주세요.");
      }
    });
  };

  return (
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
          placeholder="할 일의 제목을 입력하세요"
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

      {/* Completed Checkbox */}
      <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setCompleted(!completed)}
          disabled={isPending}
          className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition duration-200 cursor-pointer flex-shrink-0 ${
            completed
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-slate-300 dark:border-slate-600 hover:border-indigo-500"
          }`}
        >
          {completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </button>
        <span
          onClick={() => !isPending && setCompleted(!completed)}
          className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none"
        >
          완료된 투두로 마크하기
        </span>
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
              <span>저장 중...</span>
            </>
          ) : (
            <span>수정 완료</span>
          )}
        </button>
      </div>
    </form>
  );
}
