import { useState } from 'react';
import MapaMesas from './components/MapaMesas';
import { TomaDePedidos } from './components/TomaDePedidos';
import { AperturaMesa } from './components/AperturaMesa';
import mesasData from './data/mesas.json';

export default function App() {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [mesas, setMesas] = useState(mesasData);

  const [pedidosPorMesa, setPedidosPorMesa] = useState(() => {
    const memoriaInicial = {};
    mesasData.forEach(mesa => {
      memoriaInicial[mesa.numero_mesa] = mesa.pedidos || [];
    });
    return memoriaInicial;
  });

  const actualizarPedidoMesa = (numeroMesa, nuevoCarrito) => {
    setPedidosPorMesa(prev => ({
      ...prev,
      [numeroMesa]: nuevoCarrito
    }));
  };

  const manejarAperturaMesa = (datosApertura) => {
    const nuevasMesas = mesas.map(m => 
      m.numero_mesa === mesaSeleccionada.numero_mesa 
        ? { ...m, estado: 'ocupada', personas: datosApertura.personas, garzon: datosApertura.garzon } 
        : m
    );
    setMesas(nuevasMesas);

    setMesaSeleccionada(prev => ({
      ...prev,
      estado: 'ocupada',
      personas: datosApertura.personas,
      garzon: datosApertura.garzon
    }));
  };

  // ==========================================
  // NUEVO: LA FUNCIÓN PARA CERRAR LA MESA
  // ==========================================
  const liberarMesa = (numeroMesa) => {
    // 1. Pintamos la mesa de verde y borramos sus datos de apertura
    setMesas(prevMesas => prevMesas.map(m => 
      m.numero_mesa === numeroMesa 
        ? { ...m, estado: 'libre', personas: null, garzon: null } 
        : m
    ));
    
    // 2. Borramos la cuenta de esa mesa en el cerebro
    setPedidosPorMesa(prev => ({
      ...prev,
      [numeroMesa]: []
    }));

    // 3. Cerramos el panel lateral
    setMesaSeleccionada(null);
    
    alert(`✅ Cuenta pagada. La Mesa ${numeroMesa} ha quedado libre y lista para nuevos clientes.`);
  };

  return (
    <div className="h-screen bg-gray-900 overflow-hidden font-sans relative flex">

      <main className={`flex-1 bg-gray-100 h-full w-full p-6 overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-center
          ${mesaSeleccionada ? 'scale-[0.96] opacity-50 rounded-2xl pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">GastroMetric</h1>
            <p className="text-orange-500 font-medium">Vista de Salón</p>
          </div>
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
            Garzón activo
          </div>
        </header>

        <MapaMesas mesas={mesas} onSeleccionarMesa={setMesaSeleccionada} />
      </main>

      {mesaSeleccionada && (
        <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => setMesaSeleccionada(null)}></div>
      )}

      <aside className={`absolute top-0 right-0 h-full w-full md:w-[650px] bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.3)] z-20 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${mesaSeleccionada ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {mesaSeleccionada && (
          <>
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Mesa {mesaSeleccionada.numero_mesa}
                </h2>
                {mesaSeleccionada.estado === 'ocupada' && mesaSeleccionada.garzon && (
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Atiende: {mesaSeleccionada.garzon} ({mesaSeleccionada.personas} personas)
                  </p>
                )}
              </div>
              <button onClick={() => setMesaSeleccionada(null)} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold">
                Cerrar ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
              {mesaSeleccionada.estado === 'libre' ? (
                <AperturaMesa numeroMesa={mesaSeleccionada.numero_mesa} onAbrir={manejarAperturaMesa} />
              ) : (
                <TomaDePedidos 
                  numeroMesa={mesaSeleccionada.numero_mesa} 
                  carrito={pedidosPorMesa[mesaSeleccionada.numero_mesa] || []}
                  setCarrito={(nuevoCarrito) => actualizarPedidoMesa(mesaSeleccionada.numero_mesa, nuevoCarrito)}
                  // Le enviamos el botón rojo nuclear a TomaDePedidos
                  onLiberar={() => liberarMesa(mesaSeleccionada.numero_mesa)} 
                />
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}