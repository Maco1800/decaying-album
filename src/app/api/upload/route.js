import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(request) {
  const formData = await request.formData()
  const file = formData.get('file')

  const path = `${crypto.randomUUID()}.jpg`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabaseAdmin
    .storage.from('photos')
    .upload(path, buffer, { contentType: 'image/jpeg' })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const { data, error: dbError } = await supabaseAdmin
    .from('photos')
    .insert({ storage_path: path })
    .select()
    .single()

  if (dbError) return Response.json({ error: dbError.message }, { status: 500 })
  
  return Response.json({ id: data.id, path })
}