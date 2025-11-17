import { useEffect, useRef, useState } from 'react'

const POI_ICONS = {
  city: '🏰',
  dungeon: '🕳️',
  quest: '⭐',
  marker: '📍',
}

export default function MapView({ imageUrl, pois = [], onPoiClick }) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onWheel = (e) => {
      e.preventDefault()
      const delta = -e.deltaY
      const factor = delta > 0 ? 1.1 : 0.9
      setScale((s) => {
        const newScale = Math.min(6, Math.max(0.4, s * factor))
        return newScale
      })
    }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [])

  const onMouseDown = (e) => {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    panStart.current = { ...position }
  }
  const onMouseMove = (e) => {
    if (!dragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPosition({ x: panStart.current.x + dx, y: panStart.current.y + dy })
  }
  const onMouseUp = () => setDragging(false)

  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    c.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      c.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragging, position])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[70vh] bg-[#0b0e14] overflow-hidden rounded-lg border border-white/10"
    >
      <div
        className="origin-top-left"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: 'fit-content',
        }}
      >
        {imageUrl ? (
          <img ref={imgRef} src={imageUrl} alt="World Map" className="select-none pointer-events-none block" />
        ) : (
          <div className="w-[1600px] h-[900px] grid place-items-center text-white/60">
            Upload a map image in the dashboard
          </div>
        )}

        {/* POIs */}
        {pois.map((p) => (
          <button
            key={p.id}
            onClick={() => onPoiClick && onPoiClick(p)}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition"
            style={{ left: `${(p.x_coordinate || 0) * 100}%`, top: `${(p.y_coordinate || 0) * 100}%` }}
            title={p.name}
          >
            <span className="drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]">
              {POI_ICONS[p.icon_type] || POI_ICONS.marker}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
