import Link from "next/link";
import clsx from "clsx";
import { presetRanges } from "@/lib/date-range";

export default function DateRangeFilter({
  basePath,
  desde,
  hasta,
}: {
  basePath: string;
  desde?: string;
  hasta?: string;
}) {
  const { today, sevenDaysAgo, firstOfMonth } = presetRanges();

  const presets = [
    { label: "Hoy", desde: today, hasta: today },
    { label: "Últimos 7 días", desde: sevenDaysAgo, hasta: today },
    { label: "Este mes", desde: firstOfMonth, hasta: today },
  ];

  const isActive = (p: { desde: string; hasta: string }) => desde === p.desde && hasta === p.hasta;
  const isAll = !desde && !hasta;

  return (
    <div className="mb-6 space-y-3">
      <form className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">Desde</span>
          <input type="date" name="desde" defaultValue={desde} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">Hasta</span>
          <input type="date" name="hasta" defaultValue={hasta} className="input" />
        </label>
        <button
          type="submit"
          className="rounded-full bg-brand-green px-5 py-2.5 font-semibold text-white hover:bg-brand-green-dark"
        >
          Filtrar
        </button>
        {(desde || hasta) && (
          <Link
            href={basePath}
            className="rounded-full border border-brand-green/20 px-5 py-2.5 font-semibold text-brand-green-dark hover:bg-brand-cream/40"
          >
            Limpiar
          </Link>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <Link
            key={p.label}
            href={`${basePath}?desde=${p.desde}&hasta=${p.hasta}`}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-semibold",
              isActive(p)
                ? "bg-brand-green text-white"
                : "bg-brand-cream/50 text-brand-green-dark hover:bg-brand-cream"
            )}
          >
            {p.label}
          </Link>
        ))}
        <Link
          href={basePath}
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-semibold",
            isAll
              ? "bg-brand-green text-white"
              : "bg-brand-cream/50 text-brand-green-dark hover:bg-brand-cream"
          )}
        >
          Todo
        </Link>
      </div>
    </div>
  );
}
