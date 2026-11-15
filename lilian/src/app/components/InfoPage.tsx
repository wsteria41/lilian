export default function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-16 min-h-screen bg-lily-blush">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-lily-text mb-8">{title}</h1>
        <div className="bg-white rounded-3xl p-8 space-y-4 text-sm text-lily-muted leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}