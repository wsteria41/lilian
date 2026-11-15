"use client";

import { CartProvider, useCart } from "../context/CartContext";
import Nav from "./Nav";
import Footer from "./Footer";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { cartCount } = useCart();
  return (
    <>
      <Nav cartCount={cartCount} />
      {children}
      <Footer />
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
}
