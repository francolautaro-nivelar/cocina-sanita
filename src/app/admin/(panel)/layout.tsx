import { MailWarning } from "lucide-react";
import { getPendingOrdersCount } from "@/lib/admin-queries";
import AdminHeader from "./AdminHeader";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = await getPendingOrdersCount();
  const emailConfigured = Boolean(process.env.RESEND_API_KEY);

  return (
    <div className="min-h-full">
      {!emailConfigured && (
        <div className="flex items-center justify-center gap-2 bg-brand-gold/20 px-4 py-2 text-center text-xs font-semibold text-brand-green-dark">
          <MailWarning size={14} className="flex-shrink-0" />
          El aviso por mail de pedidos nuevos todavía no está activado — falta cargar
          RESEND_API_KEY en .env.local (ver README).
        </div>
      )}

      <AdminHeader pendingCount={pendingCount} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
