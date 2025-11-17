import { useEffect, useMemo, useState } from 'react'
import MapView from './MapView'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('admintoken') || '')
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [map, setMap] = useState(null)
  const [pois, setPois] = useState([])
  const [placing, setPlacing] = useState(null)
  const [form, setForm] = useState({ name: '', icon_type: 'marker', lore_article_id: '' })

  const headers = useMemo(() => ({ 'Content-Type': 'application/json' }), [])

  const authed = !!token

  const login = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/api/admin/login`, { method: 'POST', headers, body: JSON.stringify(creds) })
    if (res.ok) {
      const data = await res.json()
      setToken(data.token)
      localStorage.setItem('admintoken', data.token)
    } else alert('Login failed')
  }

  const load = async () => {
    if (!token) return
    const m = await fetch(`${API}/api/admin/map?token=${token}`).then(r=>r.json())
    setMap(m)
    const p = await fetch(`${API}/api/admin/pois?token=${token}`).then(r=>r.json())
    setPois(p)
  }

  useEffect(() => { load() }, [token])

  const uploadMap = async () => {
    const url = prompt('Enter public URL of the map image:')
    if (!url) return
    const res = await fetch(`${API}/api/admin/map?token=${token}`, { method: 'POST', headers, body: JSON.stringify({ image_url: url }) })
    if (res.ok) setMap(await res.json())
  }

  const startPlace = () => setPlacing(true)
  const onMapClick = (p) => {
    if (!placing) return
    // MapView uses button click, so we handle via callback from POIs; for placing, approximate via center
  }

  const onCreatePoi = async (e) => {
    e.preventDefault()
    const x = parseFloat(prompt('X (0..1):')||'0.5')
    const y = parseFloat(prompt('Y (0..1):')||'0.5')
    const body = { ...form, x_coordinate: x, y_coordinate: y }
    const res = await fetch(`${API}/api/admin/pois?token=${token}`, { method: 'POST', headers, body: JSON.stringify(body) })
    if (res.ok) {
      const created = await res.json()
      setPois([...(pois||[]), created])
    }
  }

  const delPoi = async (id) => {
    if (!confirm('Delete this POI?')) return
    const res = await fetch(`${API}/api/admin/pois/${id}?token=${token}`, { method: 'DELETE' })
    if (res.ok) setPois((pois||[]).filter(p=>p.id!==id))
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto bg-white/5 border border-white/10 rounded p-6 mt-12">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <form onSubmit={login} className="space-y-3">
          <input className="w-full bg-white/5 border border-white/10 rounded px-3 py-2" placeholder="Username" value={creds.username} onChange={(e)=>setCreds({...creds, username:e.target.value})} />
          <input type="password" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2" placeholder="Password" value={creds.password} onChange={(e)=>setCreds({...creds, password:e.target.value})} />
          <button className="w-full bg-blue-600 hover:bg-blue-500 rounded py-2">Sign In</button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <button onClick={()=>{localStorage.removeItem('admintoken'); setToken('')}} className="ml-auto text-sm text-white/60 hover:text-white">Sign out</button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded p-4">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="font-semibold">World Map</h3>
          <button onClick={uploadMap} className="ml-auto bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm">Set/Replace Image</button>
        </div>
        <MapView imageUrl={map?.image_url} pois={pois} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded p-4 space-y-3">
        <h3 className="font-semibold">Create POI</h3>
        <form onSubmit={onCreatePoi} className="grid sm:grid-cols-4 gap-3">
          <input className="bg-white/5 border border-white/10 rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          <select className="bg-white/5 border border-white/10 rounded px-3 py-2" value={form.icon_type} onChange={(e)=>setForm({...form, icon_type:e.target.value})}>
            <option value="marker">Marker</option>
            <option value="city">City</option>
            <option value="dungeon">Dungeon</option>
            <option value="quest">Quest</option>
          </select>
          <input className="bg-white/5 border border-white/10 rounded px-3 py-2" placeholder="Linked Lore ID (optional)" value={form.lore_article_id} onChange={(e)=>setForm({...form, lore_article_id:e.target.value})} />
          <button className="bg-emerald-600 hover:bg-emerald-500 rounded">Add POI</button>
        </form>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {(pois||[]).map(p => (
            <div key={p.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded p-3">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-white/60">({p.x_coordinate?.toFixed?.(2)}, {p.y_coordinate?.toFixed?.(2)}) • {p.icon_type}</div>
              </div>
              <button onClick={()=>delPoi(p.id)} className="text-red-300 hover:text-red-200 text-sm">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
