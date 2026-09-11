'use client'

import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  async function handleUpload() {
    if (!file) return
    setStatus('uploading...')

    const body = new FormData()
    body.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body })
    const data = await res.json()

    setStatus(data.error ? `error: ${data.error}` : `uploaded: ${data.id}`)
  }

  return (
    <main style={{ padding: 40 }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>
    </main>
  )
}