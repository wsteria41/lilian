"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";

import Link from "next/link";
import { API } from "../../lib/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const {addToCart} = useCart();

  useEffect(() => {
    fetch(`${API}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lily-rose border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!product) return null;

  return (
    <div className="pt-16 min-h-screen bg-lily-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-lily-muted mb-8">
          <Link href="/" className="hover:text-lily-rose">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-lily-text">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="flex gap-4">
            {product.images?.length > 1 && (
              <div className="flex flex-col gap-3 w-20 flex-shrink-0">
                {product.images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? "border-lily-rose"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-lily-blush">
              {product.images?.[activeImg] ? (
                <img
                  src={product.images[activeImg].image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lily-muted text-sm">
                  Зураг байхгүй
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="font-display text-3xl md:text-4xl font-medium text-lily-text leading-tight">
              {product.name}
            </h1>
            <p className="text-lily-muted text-sm mt-1 capitalize">
              {product.category}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-semibold text-lily-text">
                {Number(product.price).toLocaleString()}₮
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={i < 4 ? "#FF8FB1" : "none"}
                    stroke="#FF8FB1"
                    strokeWidth="1.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-lily-border my-6" />

            {/* Variants */}
            {product.variants?.length > 0 && (
              <>
                {/* Color */}
                <div className="mb-6">
                  <p className="text-xs font-semibold tracking-widest uppercase text-lily-muted mb-3">
                    Өнгө —{" "}
                    <span className="text-lily-text normal-case tracking-normal font-medium">
                      {selectedVariant?.color}
                    </span>
                  </p>
                  <div className="flex gap-3">
                    {[
                      ...new Map(
                        product.variants.map((v: any) => [v.color, v]),
                      ).values(),
                    ].map((v: any) => (
                      <button
                        key={v.color}
                        title={v.color}
                        onClick={() => setSelectedVariant(v)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedVariant?.color === v.color
                            ? "border-lily-rose scale-110 shadow-md"
                            : "border-lily-border hover:border-lily-pink"
                        }`}
                        style={{ backgroundColor: "#FFB3D1" }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold tracking-widest uppercase text-lily-muted">
                      Хэмжээ
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          selectedVariant?.id === v.id
                            ? "bg-lily-text text-white border-lily-text"
                            : "bg-transparent text-lily-muted border-lily-border hover:border-lily-pink hover:text-lily-text"
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                  {selectedVariant && (
                    <p className="text-xs text-lily-muted mt-2">
                      Үлдэгдэл: {selectedVariant.stock} ширхэг
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-lily-muted mb-3">
                Тоо ширхэг
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-lily-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lily-muted hover:text-lily-rose hover:bg-lily-blush"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-lily-text">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center text-lily-muted hover:text-lily-rose hover:bg-lily-blush"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!selectedVariant) return;
                  addToCart({
                    productId: product.id,
                    variantId: selectedVariant.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.images?.[0]?.image_url || "",
                    size: selectedVariant.size,
                    color: selectedVariant.color,
                    quantity: qty,
                  });
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
                className={`flex-1 py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all ${
                  added
                    ? "bg-lily-rose text-white scale-[0.98]"
                    : "bg-lily-text text-white hover:bg-lily-rose"
                }`}
              >
                {added ? "✓ Сагсанд нэмэгдлээ" : "Сагсанд нэмэх"}
              </button>
              <button className="w-14 h-14 rounded-2xl border border-lily-border flex items-center justify-center text-lily-muted hover:text-lily-rose hover:border-lily-pink">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>

            <div className="w-full h-px bg-lily-border my-6" />

            {/* Description */}
            {product.description && (
              <p className="text-sm text-lily-muted leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: "🌿", label: "Чанартай" },
                { icon: "📦", label: "Үнэгүй хүргэлт" },
                { icon: "↩", label: "30 хоног" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="text-center p-3 rounded-xl bg-lily-blush"
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-[11px] text-lily-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
