import { TomaDePedidos } from './components/TomaDePedidos';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">GastroMetric</h1>
          <p className="text-yellow-500 font-medium mt-1">Módulo Operativo - Toma de Pedidos</p>
        </div>
        <div className="bg-orange-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
          Garzón activo
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <TomaDePedidos />
      </main>
    </div>
  );
}

export default App;