import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function LoreView({ id }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/api/lore/${id}`)
      if (res.ok) setData(await res.json())
    }
    load()
  }, [id])

  if (!data) return <div className="text-white/60">Loading...</div>

  return (
    <article className="prose prose-invert max-w-none">
      <h1>{data.title}</h1>
      {data.main_image_url && <img src={data.main_image_url} alt={data.title} className="rounded" />}
      <p className="text-white/70">{data.short_description}</p>
      <div dangerouslySetInnerHTML={{ __html: data.content_body }} />
    </article>
  )
}
