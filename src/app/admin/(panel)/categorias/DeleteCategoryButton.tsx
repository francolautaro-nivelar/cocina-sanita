"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
  deleteAction,
}: {
  categoryId: string;
  categoryName: string;
  deleteAction: (categoryId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`¿Eliminar la categoría "${categoryName}"?`)) return;
    startTransition(() => {
      deleteAction(categoryId).catch((err) => alert(err.message));
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
      aria-label="Eliminar categoría"
    >
      <Trash2 size={16} />
    </button>
  );
}
