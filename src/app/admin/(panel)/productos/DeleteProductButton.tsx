"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteProductButton({
  productId,
  productName,
  deleteAction,
}: {
  productId: string;
  productName: string;
  deleteAction: (productId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`¿Eliminar "${productName}"? Esta acción no se puede deshacer.`)) return;
    startTransition(() => {
      deleteAction(productId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
      aria-label="Eliminar"
    >
      <Trash2 size={16} />
    </button>
  );
}
