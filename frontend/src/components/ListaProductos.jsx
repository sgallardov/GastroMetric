import { useState } from 'react';
import productosData from '../mocks/productos.json'; 

export function ListaProductos({ onAgregar }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  const categorias = ['Todas', ...new Set(productosData.map(p => p.categoria).filter(Boolean))];

  const productosFiltrados = productosData.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === 'Todas' || producto.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="flex flex-col bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      
      {/* 1. BARRA DE BÚSQUEDA */}
      <div className="mb-4 shrink-0">
        <input 
          type="text" 
          placeholder="🔍 Buscar producto..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 text-gray-700"
        />
      </div>

      {/* 2. BARRA DE CATEGORÍAS (CORREGIDA) */}
      {/* CORRECCIÓN 1: [&::-webkit-scrollbar]:hidden oculta la barra fea nativa.
          [-ms-overflow-style:none] y [scrollbar-width:none] lo ocultan en Firefox/Edge.
      */}
      <div className="flex overflow-x-auto gap-2 mb-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            // CORRECCIÓN 2: 'shrink-0' obliga al botón a mantener su tamaño real y no aplastarse
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              categoriaActiva === cat 
                ? 'bg-yellow-500 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. GRILLA COMPACTA (CORREGIDA) */}
      {/* CORRECCIÓN 3: Quitamos el overflow-y-auto de aquí para evitar la "doble barra" de scroll */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        {productosFiltrados.map((producto, index) => (
          <button
            key={producto.id || index}
            onClick={() => onAgregar(producto)}
            className="bg-white border border-gray-200 rounded-xl p-3 text-left hover:border-yellow-400 hover:shadow-md transition-all active:scale-95 flex flex-col justify-between min-h-[5.5rem]"
          >
            <span className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
              {producto.nombre}
            </span>
            <span className="text-yellow-600 font-bold mt-2 text-lg">
              ${producto.precio.toLocaleString('es-CL')}
            </span>
          </button>
        ))}
        
        {productosFiltrados.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400 italic">
            No se encontraron productos...
          </div>
        )}
      </div>
      
    </div>
  );
}