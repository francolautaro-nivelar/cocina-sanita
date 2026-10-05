"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteOrder } from "./actions";

export default function DeleteOrderButton({
  orderId,
  customerName,
}: {
  orderId: string;
  customerName: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`¿Eliminar el pedido de "${customerName}"?`)) return;
    startTransition(() => {
      deleteOrder(orderId).catch((err) => alert(err.message));
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full p-2 text-red-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      aria-label="Eliminar pedido"
    >
      <Trash2 size={16} />
    </button>
  );
}
