import React, { useState, useEffect } from 'react';
import mesasData from '../data/mesas.json';

const MapaMesas = () => {
  const [mesas, setMesas] = useState([]);
  
  // NUEVO: Estado para controlar qué mesa está abierta en el panel lateral
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  useEffect(() => {
    setMesas(mesasData);
  }, []);

  // Función para cerrar el panel
  const cerrarPanel = () => setMesaSeleccionada(null);

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-sm relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Mesas</h1>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Libres</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Ocupadas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mesas.map((mesa) => {
          const isLibre = mesa.estado === 'libre';
          const cardColor = isLibre ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
          const textColor = isLibre ? 'text-green-700' : 'text-red-700';

          return (
            <div 
              key={mesa.id_mesa} 
              // NUEVO: Al hacer clic, guardamos esta mesa en el estado
              onClick={() => setMesaSeleccionada(mesa)}
              className={`border-2 rounded-xl p-6 text-center transition-transform hover:scale-105 cursor-pointer ${cardColor}`}
            >
              <div className={`mx-auto w-12 h-12 mb-3 rounded-full flex items-center justify-center font-bold ${isLibre ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  M{mesa.numero_mesa}
              </div>
              <p className={`font-semibold capitalize ${textColor}`}>{mesa.estado}</p>
              <p className="text-sm text-gray-600 mt-1">Capacidad: {mesa.capacidad} pers.</p>
            </div>
          );
        })}
      </div>

      {/* =========================================
          NUEVO: PANEL LATERAL ESTILO "FUDO"
          ========================================= */}
      {mesaSeleccionada && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Fondo oscuro semi-transparente. Si haces clic afuera, se cierra */}
          <div 
            className="absolute inset-0 bg-black/40 transition-opacity" 
            onClick={cerrarPanel}
          ></div>

          {/* Caja blanca del panel (se desliza visualmente a la derecha) */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col animate-slide-in">
            
            {/* Cabecera del Panel */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Mesa {mesaSeleccionada.numero_mesa}
              </h2>
              <button onClick={cerrarPanel} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full font-bold">
                ✕
              </button>
            </div>

            {/* Si la mesa está libre */}
            {mesaSeleccionada.estado === 'libre' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">🍽️</div>
                <p>Mesa disponible</p>
                <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg w-full">
                  Abrir Mesa
                </button>
              </div>
            ) : (
              /* Si la mesa está ocupada (Muestra la cuenta) */
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-700 mb-4 uppercase text-sm tracking-wider">Detalle del Consumo</h3>
                
                {/* Lista de productos consumidos */}
                <div className="space-y-4 flex-1">
                  {mesaSeleccionada.pedidos?.length > 0 ? (
                    mesaSeleccionada.pedidos.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                        <div>
                          <p className="font-medium text-gray-800">{item.nombre}</p>
                          <p className="text-sm text-gray-500">{item.cantidad} x ${item.precio.toLocaleString('es-CL')}</p>
                        </div>
                        <p className="font-bold text-gray-900">
                          ${(item.cantidad * item.precio).toLocaleString('es-CL')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 italic mt-10">No hay productos cargados</p>
                  )}
                </div>

                {/* Totales y Botón de Pago */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6">
                    <span>Total a Pagar:</span>
                    <span>
                      {/* Magia de JavaScript: reduce() suma todos los totales de la lista */}
                      ${mesaSeleccionada.pedidos?.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0).toLocaleString('es-CL') || 0}
                    </span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full shadow-lg transition-colors">
                    Cobrar Mesa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaMesas;