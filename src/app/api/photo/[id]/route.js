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

  return Response.json({ path: row.storage_path, views })
}