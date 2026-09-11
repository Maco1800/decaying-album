'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function handleUpload() {
    if (!file || busy) return

    setBusy(true)
    setStatus('uploading...')

    try {
      const body = new FormData()
      body.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body })
      const data = await res.json()

      if (data.error) {
        setStatus(`error: ${data.error}`)
        setBusy(false)
        return
      }

      router.push('/gallery')
    } catch (err) {
      setStatus(`error: ${err.message}`)
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-light tracking-tight mb-3">
          The Decaying Album
        </h1>

        <p className="text-neutral-500 text-sm leading-relaxed mb-10">
          Upload a photograph. Every time someone opens it, it degrades a
          little. There is no original kept anywhere. Eventually there will be
          nothing left of it but a number.
        </p>

        <label className="block border border-dashed border-neutral-800 px-4 py-8 text-center cursor-pointer hover:border-neutral-600 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files[0])
              setStatus('')
            }}
          />
          <span className="text-sm text-neutral-500">
            {file ? file.name : 'choose a photograph'}
          </span>
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || busy}
          className="mt-4 w-full border border-neutral-700 px-4 py-2.5 text-sm hover:bg-neutral-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          {busy ? 'uploading...' : 'give it away'}
        </button>

        {status && (
          <p className="mt-4 text-xs text-neutral-600">{status}</p>
        )}

        <a
          href="/gallery"
          className="block mt-10 text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          or look at what's left of the others →
        </a>

      </div>
    </main>
  )
}
