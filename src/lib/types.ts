export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  unit_label: string | null;
  image_url: string | null;
  in_stock: boolean;
  active: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

export type OrderItem = {
  product_id: string;
  name: string;
  unit_label: string | null;
  price: number;
  quantity: number;
};

export type DeliveryMethod = "retiro" | "envio";

export type OrderStatus = "pendiente" | "confirmado" | "entregado" | "cancelado";

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  delivery_method: DeliveryMethod;
  address_ref: string | null;
  notes: string | null;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

// No es una tabla propia: se arma agrupando `orders` por teléfono.
export type CustomerSummary = {
  phone: string;
  name: string;
  ordersCount: number;
  totalSpent: number;
  firstOrderAt: string;
  lastOrderAt: string;
};
