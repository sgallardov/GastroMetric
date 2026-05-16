import React from 'react';

// 1. Recibe 'mesas' directamente desde App.jsx
const MapaMesas = ({ mesas, onSeleccionarMesa }) => {
  
  // ❌ AQUÍ YA NO HAY NINGÚN useState NI useEffect.
  // El componente ahora solo dibuja lo que App.jsx le ordene.

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Mesas</h1>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Libres</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Ocupadas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 2. Mapeamos directamente la propiedad 'mesas' que viene de App.jsx */}
        {mesas.map((mesa) => {
          const isLibre = mesa.estado === 'libre';
          const cardColor = isLibre ? 'border-green-500 bg-green-50 hover:bg-green-100' : 'border-red-500 bg-red-50 hover:bg-red-100';
          const textColor = isLibre ? 'text-green-700' : 'text-red-700';

          return (
            <div 
              key={mesa.id_mesa} 
              onClick={() => onSeleccionarMesa(mesa)}
              className={`border-2 rounded-xl p-6 text-center transition-all hover:scale-105 cursor-pointer shadow-sm ${cardColor}`}
            >
              <div className={`mx-auto w-12 h-12 mb-3 rounded-full flex items-center justify-center font-bold shadow-sm ${isLibre ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  M{mesa.numero_mesa}
              </div>
              <p className={`font-semibold capitalize ${textColor}`}>{mesa.estado}</p>
              
              <p className="text-sm text-gray-600 mt-1">
                {/* Si NO está libre (!isLibre), entonces mostramos los comensales */}
                {!isLibre && `${mesa.personas} comensales`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapaMesas;