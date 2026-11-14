"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Clothes", href: "/?category=clothes" },
  { label: "Shoes", href: "/?category=shoes" },
  { label: "Jewelry", href: "/?category=jewelry" },
];

export default function Nav({ cartCount = 0 }: { cartCount?: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    } catch {
      setUser(null);
    }
  }, [pathname]);

  const accountHref = user ? "/account" : "/auth";
  const accountLabel = user ? user.name : "Нэвтрэх";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-lily-white/95 backdrop-blur-md border-b border-lily-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-widest text-lily-text hover:text-lily-rose"
        >
          LILIAN
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium tracking-wide text-lily-muted hover:text-lily-rose"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link
            href={accountHref}
            className="hidden md:block text-sm font-medium text-lily-muted hover:text-lily-rose tracking-wide"
          >
            {accountLabel}
          </Link>

          <Link href="/cart" className="relative flex items-center text-lily-text hover:text-lily-rose">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-lily-rose text-white text-[10px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button className="md:hidden text-lily-text" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-lily-white border-t border-lily-border px-6 py-4 flex flex-col gap-4">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-lily-text tracking-wide"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-lily-muted"
          >
            {accountLabel}
          </Link>
        </div>
      )}
    </nav>
  );
}