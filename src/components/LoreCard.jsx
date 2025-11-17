export default function LoreCard({ item }) {
  return (
    <a href={`/lore/${item.id}`} className="block bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 p-4 transition shadow">
      <div className="flex gap-4">
        {item.main_image_url && (
          <img src={item.main_image_url} alt={item.title} className="w-20 h-20 object-cover rounded" />
        )}
        <div>
          <h3 className="text-white font-semibold">{item.title}</h3>
          <p className="text-white/70 text-sm mt-1 line-clamp-2">{item.short_description}</p>
        </div>
      </div>
    </a>
  )
}
