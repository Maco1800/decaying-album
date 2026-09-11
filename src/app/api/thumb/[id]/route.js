import { supabaseAdmin } from '@/lib/supabase-server'

// Serves the current state of a photo WITHOUT damaging it.
// The gallery grid uses this so browsing doesn't kill everything at once.

export async function GET(request, { params }) {
  const { id } = await params

  const { data: row, error } = await supabaseAdmin
    .from('photos')
    .select()
    .eq('id', id)
    .single()

  if (error || !row) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  const { data: blob } = await supabaseAdmin
    .storage.from('photos')
    .download(row.storage_path)

  const buffer = Buffer.from(await blob.arrayBuffer())

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'no-store'
    }
  })
}