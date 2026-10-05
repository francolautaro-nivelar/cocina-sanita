import type { Category, Product } from "@/lib/types";
import ImageField from "./ImageField";

export default function ProductForm({
  action,
  categories,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  product?: Product;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-brand-green/10 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Nombre
          </span>
          <input name="name" required defaultValue={product?.name} className="input" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Categoría
          </span>
          <select
            name="category_id"
            required
            defaultValue={product?.category_id}
            className="input"
          >
            <option value="" disabled>
              Elegir categoría
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Precio (ARS, vacío = sin precio/sin stock)
          </span>
          <input
            name="price"
            type="number"
            min={0}
            step={1}
            defaultValue={product?.price ?? ""}
            className="input"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Presentación (ej: x 1kg)
          </span>
          <input name="unit_label" defaultValue={product?.unit_label ?? ""} className="input" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Slug (URL, opcional)
          </span>
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            placeholder="se genera del nombre si lo dejás vacío"
            className="input"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
            Orden
          </span>
          <input
            name="sort_order"
            type="number"
            defaultValue={product?.sort_order ?? 0}
            className="input"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
          Descripción (opcional)
        </span>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          className="input min-h-20"
        />
      </label>

      <ImageField currentImageUrl={product?.image_url} />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-green-dark">
          <input
            type="checkbox"
            name="in_stock"
            defaultChecked={product?.in_stock ?? true}
          />
          Con stock
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-green-dark">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
          Visible en la tienda
        </label>
      </div>

      <button
        type="submit"
        className="rounded-full bg-brand-green px-6 py-3 font-semibold text-white hover:bg-brand-green-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}
