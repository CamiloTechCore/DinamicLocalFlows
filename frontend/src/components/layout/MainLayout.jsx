export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black">
      {/* Fondo elegante */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}