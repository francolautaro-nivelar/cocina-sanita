import { getAllCategories } from "@/lib/admin-queries";
import { createCategory, updateCategory, deleteCategory, toggleCategoryActive } from "./actions";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function AdminCategoriasPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-bold text-brand-green-dark">Categorías</h1>

      <form
        action={createCategory}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border border-brand-green/10 bg-white p-4"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Nombre
          </span>
          <input name="name" required className="input" placeholder="Ej: Vegetales" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Slug (opcional)
          </span>
          <input name="slug" className="input" placeholder="se genera del nombre" />
        </label>
        <label className="block w-24">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Orden
          </span>
          <input name="sort_order" type="number" defaultValue={categories.length + 1} className="input" />
        </label>
        <button
          type="submit"
          className="rounded-full bg-brand-green px-5 py-2.5 font-semibold text-white hover:bg-brand-green-dark"
        >
          Agregar
        </button>
      </form>

      <div className="space-y-3">
        {categories.map((category) => (
          <form
            key={category.id}
            action={updateCategory.bind(null, category.id)}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-green/10 bg-white p-4"
          >
            <input
              name="name"
              defaultValue={category.name}
              className="input flex-1 min-w-[160px]"
            />
            <span className="text-xs text-brand-green-dark/50">/{category.slug}</span>
            <input
              name="sort_order"
              type="number"
              defaultValue={category.sort_order}
              className="input w-20"
            />
            <button
              type="submit"
              className="rounded-full border border-brand-green/20 px-3 py-1.5 text-sm font-semibold text-brand-green-dark hover:bg-brand-cream/40"
            >
              Guardar
            </button>

            <ToggleActive category={category} />

            <DeleteCategoryButton
              categoryId={category.id}
              categoryName={category.name}
              deleteAction={deleteCategory}
            />
          </form>
        ))}
      </div>
    </div>
  );
}

function ToggleActive({ category }: { category: { id: string; active: boolean } }) {
  return (
    <form action={toggleCategoryActive.bind(null, category.id, !category.active)}>
      <button
        type="submit"
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          category.active
            ? "bg-brand-gold/30 text-brand-green-dark"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {category.active ? "Visible" : "Oculta"}
      </button>
    </form>
  );
}
