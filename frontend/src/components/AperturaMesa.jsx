import { useState } from 'react';

export function AperturaMesa({ numeroMesa, onAbrir }) {
  const [personas, setPersonas] = useState(2);
  const [garzon, setGarzon] = useState('');

  // Lista de garzones (Esto después puede venir de la base de datos de Santiago)
  const listaGarzones = ['Tiare', 'Vitto', 'Rodrigo', 'Juan'];

  const manejarApertura = () => {
    if (!garzon) {
      return alert("⚠️ Debes seleccionar un garzón para abrir la mesa.");
    }
    // Le enviamos a App.jsx los datos para que registre la apertura
    onAbrir({ personas, garzon });
  };

  return (
    <div className="flex flex-col h-full justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🍽️
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Mesa {numeroMesa} Disponible</h2>
        <p className="text-gray-500 mt-2">Configura la mesa antes de tomar el pedido</p>
      </div>

      {/* Control de Personas */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-3 text-center uppercase tracking-wider">
          Cantidad de Comensales
        </label>
        <div className="flex justify-center items-center gap-6">
          <button 
            onClick={() => setPersonas(Math.max(1, personas - 1))}
            className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold text-gray-600 flex items-center justify-center transition-colors"
          >
            -
          </button>
          <span className="text-4xl font-extrabold text-gray-800 w-12 text-center">
            {personas}
          </span>
          <button 
            onClick={() => setPersonas(personas + 1)}
            className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold text-gray-600 flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Selección de Garzón */}
      <div className="mb-10">
        <label className="block text-sm font-bold text-gray-700 mb-3 text-center uppercase tracking-wider">
          Garzón a cargo
        </label>
        <div className="grid grid-cols-2 gap-3">
          {listaGarzones.map(nombre => (
            <button
              key={nombre}
              onClick={() => setGarzon(nombre)}
              className={`py-3 rounded-lg font-semibold border-2 transition-all ${
                garzon === nombre 
                  ? 'border-orange-500 bg-orange-50 text-orange-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200'
              }`}
            >
              {nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Botón de Acción */}
      <button 
        onClick={manejarApertura}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-green-200"
      >
        Abrir Mesa y Tomar Pedido
      </button>
    </div>
  );
}