import Link from "next/link";
import { Suspense } from "react";
import TodoControls from "./TodoControls";
import TodoItem from "./TodoItem";
import { getTodos } from "../actions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    search?: string;
  }>;
}

export default async function TodosPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter;
  const search = resolvedParams.search;

  // Fetch todos via Server Action
  const todos = await getTodos(filter, search);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Todo List
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            할 일을 관리하고 기록해보세요.
          </p>
        </div>
        <Link
          href="/todos/new"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition duration-200 text-sm cursor-pointer"
        >
          + 새 Todo 추가
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <Suspense
        fallback={
          <div className="h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl mb-6"></div>
        }
      >
        <TodoControls />
      </Suspense>

      {/* Todo List */}
      <div className="space-y-4">
        {todos.length > 0 ? (
          todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801-1.206a2.25 2.25 0 00-3.32 0c-.808.808-1.92 1.341-3.123 1.362-1.124.018-2.097.918-2.097 2.057v10.377a2.25 2.25 0 002.25 2.25h14.25M9 6h6.75"
              />
            </svg>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
              할 일이 없습니다
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {search || filter
                ? "검색어나 필터 조건에 부합하는 항목이 없어요."
                : "새로운 투두를 등록하고 오늘 하루 일정을 계획해보세요!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
