import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase-server'

// Never cache this page — view counts change constantly.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Gallery() {
  const { data: photos } = await supabaseAdmin
    .from('photos')
    .select()
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <header className="mb-16">
          <h1 className="text-3xl font-light tracking-tight mb-3">
            The Decaying Album
          </h1>
          <p className="text-neutral-500 text-sm max-w-md leading-relaxed">
            Every photograph here degrades a little each time it is opened.
            There are no originals and no backups. Looking costs something.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 text-xs text-neutral-400 border border-neutral-800 px-3 py-1.5 hover:border-neutral-600 transition-colors"
          >
            upload a photograph
          </Link>
        </header>

        {(!photos || photos.length === 0) && (
          <p className="text-neutral-600 text-sm">Nothing here yet.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {photos?.map((p) => (
            <Link
              key={p.id}
              href={`/photo/${p.id}`}
              prefetch={false}
              className="group block"
            >
              <div className="aspect-square overflow-hidden bg-neutral-900">
                {/* plain <img>, NOT next/image — next/image would cache and
                    optimise, which defeats the entire mechanic */}
                <img
                  src={`/api/thumb/${p.id}?v=${p.views}`}
                  alt=""
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-neutral-600">
                <span>{p.views} views</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  open →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}
