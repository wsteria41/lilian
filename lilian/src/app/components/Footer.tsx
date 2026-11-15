import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-lily-border bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl font-semibold text-lily-text tracking-widest">LILIAN</Link>
        <p className="text-xs text-lily-muted tracking-wide">© {new Date().getFullYear()} Lilian. Бүх эрх хуулиар хамгаалагдсан.</p>
        <div className="flex gap-6 text-xs text-lily-muted">
          <Link href="/privacy" className="hover:text-lily-rose">Нууцлал</Link>
          <Link href="/terms" className="hover:text-lily-rose">Үйлчилгээний нөхцөл</Link>
          <Link href="/contact" className="hover:text-lily-rose">Холбоо барих</Link>
        </div>
      </div>
    </footer>
  )
}