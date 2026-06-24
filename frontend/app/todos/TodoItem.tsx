"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Todo, deleteTodo, updateTodo } from "../actions";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await updateTodo(todo.id, { completed: !todo.completed });
      } catch (error) {
        alert("상태 변경에 실패했습니다.");
      }
    });
  };

  const handleDelete = () => {
    if (confirm("정말 이 Todo를 삭제하시겠습니까?")) {
      startTransition(async () => {
        try {
          await deleteTodo(todo.id);
        } catch (error) {
          alert("삭제에 실패했습니다.");
        }
      });
    }
  };

  return (
    <div
      className={`p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm hover:shadow-md transition duration-200 ${
        todo.completed ? "bg-slate-50/50 dark:bg-slate-800/30 opacity-75" : ""
      }`}
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0 pr-4">
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition duration-200 cursor-pointer flex-shrink-0 ${
            todo.completed
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-slate-300 dark:border-slate-600 hover:border-indigo-500"
          }`}
        >
          {todo.completed && (
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

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-slate-800 dark:text-slate-100 truncate ${
              todo.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`text-sm text-slate-500 dark:text-slate-400 mt-1 truncate ${
                todo.completed ? "line-through opacity-75" : ""
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1.5 flex-shrink-0">
        <Link
          href={`/todos/${todo.id}`}
          className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition duration-200"
        >
          수정
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition duration-200 cursor-pointer"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
