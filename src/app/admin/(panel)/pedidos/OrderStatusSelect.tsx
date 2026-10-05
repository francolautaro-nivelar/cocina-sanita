"use client";

import { useTransition } from "react";
import clsx from "clsx";
import type { OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "./actions";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente: "bg-brand-gold/30 text-brand-green-dark",
  confirmado: "bg-brand-sage/30 text-brand-green-dark",
  entregado: "bg-brand-green/20 text-brand-green-dark",
  cancelado: "bg-red-100 text-red-700",
};

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus;
    startTransition(() => {
      updateOrderStatus(orderId, next).catch((err) => alert(err.message));
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={clsx(
        "rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none disabled:opacity-50",
        STATUS_STYLES[status]
      )}
    >
      {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((key) => (
        <option key={key} value={key}>
          {STATUS_LABELS[key]}
        </option>
      ))}
    </select>
  );
}
