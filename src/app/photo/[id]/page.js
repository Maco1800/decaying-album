import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PhotoPage({ params }) {
  const { id } = await params

  const { data: row } = await supabaseAdmin
    .from('photos')
    .select()
    .eq('id', id)
    .single()

  if (!row) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-500 flex items-center justify-center">
        <p className="text-sm">This photograph does not exist.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 px-6 py-12">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/gallery"
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← back
        </Link>

        <div className="mt-8 bg-neutral-900">
          <img
            src={`/api/photo/${id}?v=${Date.now()}`}
            alt=""
            className="w-full"
          />
        </div>

        <div className="mt-4 flex justify-between items-baseline text-xs text-neutral-600">
          <span>{row.views} views before this one</span>
          <span>uploaded {new Date(row.created_at).toLocaleDateString()}</span>
        </div>

        <p className="mt-10 text-[11px] text-neutral-700 leading-relaxed max-w-sm">
          Refreshing this page will damage it further. There is no undo and no
          stored original.
        </p>

      </div>
    </main>
  )
}
