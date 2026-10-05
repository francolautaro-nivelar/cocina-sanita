import { getCustomers } from "@/lib/admin-queries";
import { formatPrice } from "@/lib/format";
import ClientesTable from "./ClientesTable";

export default async function AdminClientesPage() {
  const customers = await getCustomers();
  const totalClientes = customers.length;
  const clientesRecurrentes = customers.filter((c) => c.ordersCount > 1).length;
  const totalFacturado = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-bold text-brand-green-dark">Clientes</h1>
      <p className="mb-6 text-sm text-brand-green-dark/60">
        Se arma automáticamente a partir de los pedidos (agrupados por teléfono).
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Clientes" value={totalClientes.toString()} />
        <StatCard label="Con más de 1 pedido" value={clientesRecurrentes.toString()} />
        <StatCard label="Total facturado" value={formatPrice(totalFacturado)} />
      </div>

      {customers.length === 0 ? (
        <p className="rounded-xl bg-brand-cream/30 px-4 py-6 text-brand-green-dark/70">
          Todavía no hay pedidos, así que no hay clientes para mostrar.
        </p>
      ) : (
        <ClientesTable customers={customers} />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-brand-cream/30 px-5 py-4">
      <p className="text-sm font-semibold text-brand-green-dark/60">{label}</p>
      <p className="font-display text-2xl font-bold text-brand-green-dark">{value}</p>
    </div>
  );
}
