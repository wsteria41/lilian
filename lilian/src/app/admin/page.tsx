"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { API } from '../lib/api'

interface Variant {
  id: number;
  size: string;
  color: string;
  stock: number;
}
interface Img {
  id: number;
  image_url: string;
}
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
}

interface Order {
  id: number;
  user_id: number;
  total_price: string;
  status: string;
  created_at: string;
}

const STATUSES = [
  { value: "pending", label: "Хүлээгдэж байна" },
  { value: "preparing", label: "Бэлдэж байна" },
  { value: "shipping", label: "Хүргэж байна" },
  { value: "delivered", label: "Хүргэгдсэн" },
  { value: "cancelled", label: "Цуцлагдсан" },
];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "clothes",
  });
  const [editing, setEditing] = useState<number | null>(null);
  const [detail, setDetail] = useState<{
    variants: Variant[];
    images: Img[];
  } | null>(null);
  const [vForm, setVForm] = useState({ size: "", color: "", stock: "" });
  const [uploading, setUploading] = useState(false);

  const token = () => localStorage.getItem("token") || "";
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  });

  const loadProducts = useCallback(async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  }, []);

  const loadOrders = useCallback(async () => {
    const res = await fetch(`${API}/orders`, { headers: authHeaders() });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user || user.role !== "admin") {
        router.push("/account");
        return;
      }
    } catch {
      router.push("/auth");
      return;
    }
    setReady(true);
    loadProducts();
    loadOrders();
  }, [router, loadProducts, loadOrders]);

  const createProduct = async () => {
    setError("");
    if (!form.name.trim() || !form.price) {
      setError("Нэр болон үнийг оруулна уу");
      return;
    }
    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Алдаа гарлаа");
      return;
    }
    setForm({ name: "", description: "", price: "", category: "clothes" });
    loadProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Энэ бүтээгдэхүүнийг устгах уу?")) return;
    const res = await fetch(`${API}/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Устгаж чадсангүй");
      return;
    }
    loadProducts();
  };

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`${API}/orders/${id}/status`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadOrders();
  };

  const openEdit = async (id: number) => {
    if (editing === id) {
      setEditing(null);
      setDetail(null);
      return;
    }
    setEditing(id);
    const res = await fetch(`${API}/products/${id}`);
    const data = await res.json();
    setDetail({ variants: data.variants || [], images: data.images || [] });
  };

  const reloadDetail = async (id: number) => {
    const res = await fetch(`${API}/products/${id}`);
    const data = await res.json();
    setDetail({ variants: data.variants || [], images: data.images || [] });
  };

  const addVariant = async (id: number) => {
    setError("");
    if (!vForm.size.trim() || !vForm.color.trim() || vForm.stock === "") {
      setError("Хэмжээ, өнгө, үлдэгдлийг бүгдийг нь оруулна уу");
      return;
    }
    const res = await fetch(`${API}/products/${id}/variants`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        size: vForm.size,
        color: vForm.color,
        stock: Number(vForm.stock),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Variant нэмж чадсангүй");
      return;
    }
    setVForm({ size: "", color: "", stock: "" });
    reloadDetail(id);
  };

  const uploadImage = async (id: number, file: File) => {
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${API}/products/${id}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: fd,
    });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Зураг upload хийж чадсангүй");
      return;
    }
    reloadDetail(id);
  };

  const deleteImage = async (productId: number, imageId: number) => {
    if (!confirm("Энэ зургийг устгах уу?")) return;
    const res = await fetch(`${API}/products/images/${imageId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      setError("Зураг устгаж чадсангүй");
      return;
    }
    reloadDetail(productId);
  };

  const deleteVariant = async (productId: number, variantId: number) => {
    if (!confirm("Энэ variant-ийг устгах уу?")) return;
    const res = await fetch(`${API}/products/variants/${variantId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      setError("Variant устгаж чадсангүй");
      return;
    }
    reloadDetail(productId);
  };

  if (!ready) return null;

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-lily-border bg-lily-white text-sm text-lily-text placeholder:text-lily-muted focus:outline-none focus:border-lily-accent";

  return (
    <div className="pt-16 min-h-screen bg-lily-blush">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-medium text-lily-text mb-6">
          Админ самбар
        </h1>

        <div className="flex gap-2 mb-8">
          {(["products", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-lily-rose text-white"
                  : "bg-white text-lily-muted hover:text-lily-rose"
              }`}
            >
              {t === "products" ? "Бүтээгдэхүүн" : "Захиалга"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-500">
            {error}
          </div>
        )}

        {tab === "products" ? (
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Form */}
            <div className="bg-white rounded-3xl p-6 space-y-3">
              <h2 className="font-display text-xl text-lily-text">
                Шинэ бүтээгдэхүүн
              </h2>
              <input
                className={inputClass}
                placeholder="Нэр"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                rows={3}
                className={inputClass + " resize-none"}
                placeholder="Тайлбар"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <input
                type="number"
                className={inputClass}
                placeholder="Үнэ (₮)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="clothes">Хувцас</option>
                <option value="shoes">Гутал</option>
                <option value="jewelry">Зүүлт</option>
              </select>
              <button
                onClick={createProduct}
                className="w-full bg-lily-rose text-white font-semibold text-sm py-3.5 rounded-2xl hover:bg-lily-deep"
              >
                Нэмэх
              </button>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6">
              <h2 className="font-display text-xl text-lily-text mb-4">
                Бүтээгдэхүүн ({products.length})
              </h2>
              {products.length === 0 ? (
                <p className="text-sm text-lily-muted py-8 text-center">
                  Бүтээгдэхүүн байхгүй
                </p>
              ) : (
                <div className="space-y-2">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-lily-border"
                    >
                      <div className="flex items-center justify-between gap-4 p-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-lily-text truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-lily-muted capitalize">
                            {p.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-lily-rose whitespace-nowrap">
                            {Number(p.price).toLocaleString()}₮
                          </span>
                          <button
                            onClick={() => openEdit(p.id)}
                            className="text-xs text-lily-rose hover:underline"
                          >
                            {editing === p.id ? "Хаах" : "Зураг/Хэмжээ"}
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-xs text-lily-muted hover:text-red-500"
                          >
                            Устгах
                          </button>
                        </div>
                      </div>

                      {editing === p.id && detail && (
                        <div className="border-t border-lily-border p-4 space-y-5 bg-lily-blush/40 rounded-b-2xl">
                          {/* Images */}
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-lily-muted mb-2">
                              Зураг
                            </p>
                            <div className="flex flex-wrap gap-2 items-center">
                              {detail.images.map((img) => (
                                <div key={img.id} className="relative group">
                                  <img
                                    src={img.image_url}
                                    alt=""
                                    className="w-16 h-20 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => deleteImage(p.id, img.id)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <label className="w-16 h-20 rounded-lg border-2 border-dashed border-lily-pink flex items-center justify-center text-xs text-lily-rose cursor-pointer hover:bg-white text-center">
                                {uploading ? "..." : "+ Нэмэх"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) uploadImage(p.id, f);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Variants */}
                          <div>
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-lily-muted mb-2">
                              Хэмжээ / Өнгө / Үлдэгдэл
                            </p>
                            <div className="space-y-1 mb-3">
                              {detail.variants.length === 0 && (
                                <p className="text-xs text-lily-muted">
                                  Variant байхгүй
                                </p>
                              )}
                              {detail.variants.map((v) => (
                                <div
                                  key={v.id}
                                  className="flex items-center justify-between text-sm text-lily-text"
                                >
                                  <span>
                                    {v.size} · {v.color} ·{" "}
                                    <span className="text-lily-muted">
                                      {v.stock} ширхэг
                                    </span>
                                  </span>
                                  <button
                                    onClick={() => deleteVariant(p.id, v.id)}
                                    className="text-xs text-lily-muted hover:text-red-500"
                                  >
                                    Устгах
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <input
                                className={inputClass}
                                placeholder="Хэмжээ"
                                value={vForm.size}
                                onChange={(e) =>
                                  setVForm({ ...vForm, size: e.target.value })
                                }
                              />
                              <input
                                className={inputClass}
                                placeholder="Өнгө"
                                value={vForm.color}
                                onChange={(e) =>
                                  setVForm({ ...vForm, color: e.target.value })
                                }
                              />
                              <input
                                type="number"
                                className={inputClass}
                                placeholder="Тоо"
                                value={vForm.stock}
                                onChange={(e) =>
                                  setVForm({ ...vForm, stock: e.target.value })
                                }
                              />
                              <button
                                onClick={() => addVariant(p.id)}
                                className="bg-lily-text text-white text-sm font-semibold rounded-xl hover:bg-lily-rose"
                              >
                                Нэмэх
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6">
            <h2 className="font-display text-xl text-lily-text mb-4">
              Захиалга ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-lily-muted py-8 text-center">
                Захиалга байхгүй
              </p>
            ) : (
              <div className="space-y-2">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-lily-border"
                  >
                    <div>
                      <p className="text-sm font-semibold text-lily-text">
                        Захиалга #{o.id}
                      </p>
                      <p className="text-xs text-lily-muted">
                        Хэрэглэгч #{o.user_id} ·{" "}
                        {new Date(o.created_at).toLocaleDateString("en-CA")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-lily-rose">
                        {Number(o.total_price).toLocaleString()}₮
                      </span>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="px-3 py-2 rounded-xl border border-lily-border text-xs bg-white"
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
