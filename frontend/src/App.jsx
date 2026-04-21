// 1. IMPORTACIONES DE AMBOS MÓDULOS
import React from 'react';
import { TomaDePedidos } from './components/TomaDePedidos';
import MapaMesas from './components/MapaMesas'; // Importación de Vitto (sin llaves porque probablemente usó export default)

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      
      {/* EL ENCABEZADO (Diseño de Tiare) */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">GastroMetric</h1>
          <p className="text-orange-500 font-medium mt-1">Módulos Integrados (Fase 1)</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
          Garzón activo
        </div>
      </header>

      {/* EL CONTENIDO PRINCIPAL (Ambos componentes unidos) */}
      <main className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Sección de Vitto */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
            Paso 1: Estado del Comedor
          </h2>
          <MapaMesas />
        </section>

        {/* Sección de Tiare */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b-2 border-gray-200 pb-2">
            Paso 2: Tomar Pedido
          </h2>
          <TomaDePedidos />
        </section>

      </main>
    </div>
  );
}

export default App;