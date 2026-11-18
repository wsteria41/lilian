"use client";

import { useState, useEffect, Suspense } from "react";
import ProductCard from "./components/ProductCard";
import { useSearchParams } from "next/navigation";
import { API } from "./lib/api";

const CATEGORIES = [
  {
    label: "Clothes",
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=280&fit=crop&auto=format",
    cat: "clothes",
  },
  {
    label: "Shoes",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=280&fit=crop&auto=format",
    cat: "shoes",
  },
  {
    label: "Jewelry",
    img: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=400&h=280&fit=crop&auto=format",
    cat: "jewelry",
  },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [covers, setCovers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const m: Record<string, string> = {};
        for (const p of data) {
          const img = p.images?.[0]?.image_url;
          if (img && !m[p.category]) m[p.category] = img;
        }
        setCovers(m);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const c = searchParams.get("category");
    setActiveCategory(c || "all");
    if (c)
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" });
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const url =
      activeCategory === "all"
        ? `${API}/products`
        : `${API}/products?category=${activeCategory}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1561897519-6e4fbd1fbc41?w=1600&h=1000&fit=crop&auto=format"
          alt="Lily flowers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lily-text/70 via-lily-text/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <div className="max-w-2xl">
            <p className="text-lily-soft text-sm font-medium tracking-[0.3em] uppercase mb-5">
              New Collection — Spring 2026
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-medium text-white leading-[1.05] mb-6">
              Bloom in
              <br />
              <em className="italic text-lily-pink">Elegance</em>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-lg font-light">
              Inspired by the delicate beauty of lily flowers — a curated
              collection that celebrates feminine grace and modern refinement.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white text-lily-text font-semibold text-sm tracking-wide px-8 py-3.5 rounded-full hover:bg-lily-pink hover:text-white"
              >
                Shop the Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="py-16 bg-lily-blush">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CATEGORIES.map(({ label, cat }) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-gradient-to-br from-lily-soft via-lily-pink/60 to-lily-accent/70 text-left"
              >
                {covers[cat] && (
                  <img
                    src={covers[cat]}
                    alt={label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d0f20]/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="block font-display text-3xl font-medium text-white">
                    {label}
                  </span>
                  <span className="inline-block mt-2 text-xs tracking-[0.2em] uppercase text-lily-pink group-hover:translate-x-1 transition-transform">
                    Үзэх →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-lily-muted text-xs font-medium tracking-[0.25em] uppercase mb-3">
                Curated For You
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-medium text-lily-text leading-tight">
                Featured <em className="italic text-lily-rose">Pieces</em>
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "clothes", "shoes", "jewelry"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all border ${
                    activeCategory === cat
                      ? "bg-lily-rose text-white border-lily-rose"
                      : "bg-transparent border-lily-border text-lily-muted hover:border-lily-pink"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-lily-rose border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-lily-muted">
              Бүтээгдэхүүн олдсонгүй
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Marquee */}
        <div className="mt-16 py-4 bg-lily-soft overflow-hidden">
          <div className="flex gap-8 animate-[marquee_18s_linear_infinite] whitespace-nowrap">
            {Array.from({ length: 3 }).flatMap((_, i) =>
              [
                "New Arrivals",
                "✦",
                "Free Shipping",
                "✦",
                "Ethically Made",
                "✦",
                "Easy Returns",
                "✦",
              ].map((t, j) => (
                <span
                  key={`${i}-${j}`}
                  className="text-xs font-semibold tracking-[0.25em] uppercase text-lily-rose"
                >
                  {t}
                </span>
              )),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
