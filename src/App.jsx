import { useEffect, useState } from 'react'
import MapView from './components/MapView'
import LoreCard from './components/LoreCard'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [map, setMap] = useState(null)
  const [pois, setPois] = useState([])
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const m = await fetch(`${API}/api/admin/map?token=public`).then(r => r.json()).catch(() => null)
        setMap(m)
        const p = await fetch(`${API}/api/pois`).then(r => r.json())
        setPois(p)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query) { setResults([]); return }
      const res = await fetch(`${API}/api/lore/search?q=${encodeURIComponent(query)}`).then(r => r.json())
      setResults(res)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className="min-h-screen bg-[#0a0c11] text-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <span className="font-black tracking-wide text-xl">Elder Realms Atlas</span>
          <nav className="ml-auto flex items-center gap-3">
            <a href="#map" className="text-white/80 hover:text-white">Map</a>
            <a href="#lore" className="text-white/80 hover:text-white">Lore</a>
            <a href="/test" className="text-white/60 hover:text-white text-sm">Status</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <section id="map" className="space-y-4">
          <h2 className="text-2xl font-semibold">World Map</h2>
          <MapView imageUrl={map?.image_url} pois={pois} onPoiClick={setSelected} />
          {selected && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📍</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selected.name}</h3>
                  <p className="text-white/70 mt-1">{selected.short_description || 'A location of interest.'}</p>
                  {selected.lore_article_id && (
                    <a href={`/lore/${selected.lore_article_id}`} className="inline-block mt-3 text-sm text-blue-300 hover:text-blue-200">Read more →</a>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <section id="lore" className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">Lore Wiki</h2>
            <div className="ml-auto w-full sm:w-80">
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search lore..." className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          {results.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map(r => <LoreCard key={r.id} item={r} />)}
            </div>
          ) : (
            <p className="text-white/60">Type to search stories, characters, and locations.</p>
          )}
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-white/50 text-sm">© {new Date().getFullYear()} Elder Realms</footer>
    </div>
  )
}

export default App
