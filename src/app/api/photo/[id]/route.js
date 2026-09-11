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

  const quality = Math.max(4, 90 - views * 10)
  const meta = await sharp(buffer).metadata()

  // 1. RESAMPLING FIRST — shrink and restore with hard pixels.
  //    Anything after this survives; anything before gets smoothed over.
  let img = sharp(buffer)
    .resize(Math.round(meta.width * 0.7))
    .resize(meta.width, null, { kernel: 'nearest' })

  // 2. COLOUR — compounds every view

  img = img.modulate({
    hue: Math.round(Math.random() * 8 - 4)
  })
/*
  if (views > 4) {
    img = img.tint({
      r: Math.max(120, 255 - views * 2),
      g: Math.max(120, 255 - views),
      b: 255
    })
  }
  */

  // 3. STRUCTURE LAST — nothing resamples over these
  if (views > 2) {
    img = img.blur(1.2)
  }

  const decayed = await img.jpeg({ quality }).toBuffer()

  await supabaseAdmin.storage.from('photos')
    .upload(row.storage_path, decayed, {
      contentType: 'image/jpeg',
      upsert: true,
      cacheControl: '0'
    })

  return new Response(decayed, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'no-store'
    }
  })
}