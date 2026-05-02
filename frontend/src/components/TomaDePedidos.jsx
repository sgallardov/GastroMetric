import { useState } from 'react';
import { ListaProductos } from './ListaProductos';
import { PantallaPago } from './PantallaPago'; // <-- IMPORTAMOS LA NUEVA PANTALLA

export function TomaDePedidos({ numeroMesa, carrito, setCarrito, onLiberar }) {
  
  const [incluyePropina, setIncluyePropina] = useState(false);
  
  // NUEVO ESTADO: ¿Estamos en modo pago o en modo carrito?
  const [modoPago, setModoPago] = useState(false);

  const manejarAgregar = (producto) => setCarrito([...carrito, producto]);

  const manejarEliminar = (indexAEliminar) => {
    setCarrito(carrito.filter((_, index) => index !== indexAEliminar));
  };

  const subtotal = carrito.reduce((suma, item) => suma + item.precio, 0);
  const propinaCalculada = Math.round(subtotal * 0.10); 
  const totalCuenta = subtotal + (incluyePropina ? propinaCalculada : 0);

  const manejarConfirmar = () => {
    if (carrito.length === 0) {
      return alert("⚠️ Agrega productos antes de enviar la comanda.");
    }
    alert(`👩‍🍳 ¡Marchando a cocina para la Mesa ${numeroMesa}!`);
  };

  // --- SEMÁFORO DE VISTAS ---
  // Si estamos en modo pago, mostramos SOLO la pantalla de caja
  if (modoPago) {
    return (
      <div className="h-full">
        <PantallaPago 
          numeroMesa={numeroMesa}
          totalCuenta={totalCuenta}
          onCancelar={() => setModoPago(false)} // Para volver al carrito
          onConfirmar={onLiberar} // Libera la mesa al final
        />
      </div>
    );
  }

  // Si no estamos en modo pago, mostramos la vista normal (Carta + Carrito)
  return (
    <div className="flex flex-col gap-6 h-full pb-4">
      
      <div className="flex-1 overflow-y-auto pr-2">
        <ListaProductos onAgregar={manejarAgregar} />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border border-gray-200 mt-auto">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-yellow-200 pb-2 mb-4">
          Comanda Actual
        </h2>
        
        {carrito.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Aún no hay productos en el pedido...</p>
        ) : (
          <ul className="mb-4 max-h-40 overflow-y-auto pr-2">
            {carrito.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b border-gray-50 text-sm">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => manejarEliminar(index)}
                    className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full w-6 h-6 flex items-center justify-center transition-colors font-bold"
                  >
                    ✕
                  </button>
                  <span className="text-gray-700 font-medium">{item.nombre}</span>
                </div>
                <span className="font-semibold text-gray-800">
                  ${item.precio.toLocaleString('es-CL')}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t-2 border-gray-100 pt-3 mt-2">
          
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString('es-CL')}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-medium mb-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700">
              <input 
                type="checkbox" 
                checked={incluyePropina}
                onChange={() => setIncluyePropina(!incluyePropina)}
                className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500 accent-yellow-500"
                disabled={subtotal === 0} 
              />
              Incluir propina sugerida (10%)
            </label>
            <span className={incluyePropina ? "text-yellow-600 font-bold" : "text-gray-400"}>
              ${propinaCalculada.toLocaleString('es-CL')}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4 border-t pt-2 border-dashed">
            <span className="text-lg text-gray-800 font-bold">Total a cobrar:</span>
            <span className="text-2xl font-black text-yellow-500 tracking-tight">
              ${totalCuenta.toLocaleString('es-CL')}
            </span>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={manejarConfirmar}
              className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              Enviar a Cocina
            </button>

            <button 
              // En lugar de cobrar, ahora cambiamos a modoPago!
              onClick={() => {
                if(carrito.length === 0) return alert("El carrito está vacío");
                setModoPago(true);
              }}
              className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
            >
              Cobrar
            </button>
          </div>

        </div>
      </div>
      
    </div>
  );
}