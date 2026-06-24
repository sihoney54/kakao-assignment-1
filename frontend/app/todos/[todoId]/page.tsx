import Link from "next/link";
import { notFound } from "next/navigation";
import EditTodoForm from "./EditTodoForm";
import { getTodoById } from "../../actions";

interface PageProps {
  params: Promise<{
    todoId: string;
  }>;
}

export default async function EditTodoPage({ params }: PageProps) {
  const resolvedParams = await params;
  const todoId = Number(resolvedParams.todoId);

  if (isNaN(todoId)) {
    notFound();
  }

  const todo = await getTodoById(todoId);
  if (!todo) {
    notFound();
  }

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
          Todo 수정
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          기존 할 일의 제목, 설명 또는 완료 상태를 변경합니다.
        </p>
      </div>

      <EditTodoForm todo={todo} />
    </div>
  );
}
