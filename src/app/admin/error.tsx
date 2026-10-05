"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-brand-green-dark">
        Ocurrió un error
      </h1>
      <p className="mt-2 text-brand-green-dark/70">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-brand-green px-6 py-3 font-semibold text-white hover:bg-brand-green-dark"
      >
        Reintentar
      </button>
    </div>
  );
}
