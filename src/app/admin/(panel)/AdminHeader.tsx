"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, Store } from "lucide-react";
import clsx from "clsx";
import { signOut } from "@/app/admin/login/actions";

const NAV = [
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/finanzas", label: "Finanzas" },
];

export default function AdminHeader({ pendingCount }: { pendingCount: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-brand-green/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/admin/productos" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo-cocina-sanita.jpg"
            alt="Cocina Sanita"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-display font-bold text-brand-green-dark">Admin</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-full px-3 py-1.5 text-sm font-semibold text-brand-green-dark hover:bg-brand-cream/40"
            >
              {item.label}
              {item.href === "/admin/pedidos" && pendingCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-xs font-bold text-brand-green-dark">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/" className="text-sm font-semibold text-brand-olive hover:underline">
            Ver tienda
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-1 rounded-full border border-brand-green/20 px-3 py-1.5 text-sm font-semibold text-brand-green-dark hover:bg-brand-cream/40"
            >
              <LogOut size={14} /> Salir
            </button>
          </form>
        </div>

        <button
          type="button"
          className="relative rounded-md p-2 text-brand-green-dark lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
          {!open && pendingCount > 0 && (
            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-green-dark">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-brand-green/10 bg-white px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "flex items-center justify-between rounded-md px-2 py-2.5 font-semibold text-brand-green-dark hover:bg-brand-cream/40",
                pathname.startsWith(item.href) && "bg-brand-cream/40"
              )}
            >
              {item.label}
              {item.href === "/admin/pedidos" && pendingCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-xs font-bold text-brand-green-dark">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}

          <div className="mt-2 flex items-center gap-2 border-t border-brand-green/10 pt-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-green/20 px-3 py-2 text-sm font-semibold text-brand-green-dark hover:bg-brand-cream/40"
            >
              <Store size={14} /> Ver tienda
            </Link>
            <form action={signOut} className="flex-1">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-brand-green/20 px-3 py-2 text-sm font-semibold text-brand-green-dark hover:bg-brand-cream/40"
              >
                <LogOut size={14} /> Salir
              </button>
            </form>
          </div>
        </nav>
      )}
    </header>
  );
}
