'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  category: string
  images?: { image_url: string }[]
}

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)

  const primaryImage = product.images?.[0]?.image_url
  const secondImage = product.images?.[1]?.image_url

  return (
    <Link
      href={`/products/${product.id}`}
      className="group text-left w-full block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-lily-blush aspect-[3/4]">
        {primaryImage ? (
          <img
            src={hovered && secondImage ? secondImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lily-muted text-sm">
            Зураг байхгүй
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-lily-text">Quick View</span>
          </div>
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-display text-base font-medium text-lily-text leading-tight">{product.name}</h3>
        <p className="text-xs text-lily-muted mt-0.5 capitalize">{product.category}</p>
        <p className="text-sm font-semibold text-lily-text mt-2">
          {Number(product.price).toLocaleString()}₮
        </p>
      </div>
    </Link>
  )
}