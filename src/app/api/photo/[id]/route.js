import sharp from 'sharp'
import { supabaseAdmin } from '@/lib/supabase-server'

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

  const { data: views } = await supabaseAdmin
    .rpc('increment_views', { photo_id: id })

  const { data: blob } = await supabaseAdmin
    .storage.from('photos')
    .download(row.storage_path)

  const buffer = Buffer.from(await blob.arrayBuffer())

  const quality = Math.max(15, 95 - views * 2)

  const decayed = await sharp(buffer)
    .jpeg({ quality })
    .toBuffer()

  await supabaseAdmin.storage.from('photos')
    .upload(row.storage_path, decayed, {
      contentType: 'image/jpeg',
      upsert: true
    })

  return new Response(decayed, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'no-store'
    }
  })
}