import { useState } from 'react';
import { ListaProductos } from './ListaProductos';

export function TomaDePedidos() {
  // 1. ESTADO: La memoria del carrito
  const [carrito, setCarrito] = useState([]);

  // 2. LÓGICA: Agregar
  const manejarAgregar = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // 3. LÓGICA: Eliminar
  const manejarEliminar = (indexAEliminar) => {
    console.log("Intentando eliminar la posición:", indexAEliminar); // <-- Agregamos esto para espiar
    
    // filtra para dejar todos los elementos MENOS el que coincide con el index
    const nuevoCarrito = carrito.filter((_, index) => index !== indexAEliminar);
    setCarrito(nuevoCarrito);
  };

  // 4. MATEMÁTICA: Sumar total
  const totalCuenta = carrito.reduce((suma, item) => suma + item.precio, 0);

  // 5. LÓGICA: Confirmar y limpiar
  const manejarConfirmar = () => {
    // Si el carrito está vacío, se detiene la función y avisa
    if (carrito.length === 0) {
      alert("⚠️ El carrito está vacío. Agrega productos antes de enviar la comanda.");
      return;
    }

    // Si hay productos, se muestra el mensaje de éxito con el total
    alert(`✅ ¡Pedido confirmado por $${totalCuenta.toLocaleString('es-CL')}!\n\nLa comanda ha sido enviada a cocina.`);
    
    // y se  devuelve el estado del carrito a un arreglo vacío
    setCarrito([]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* LADO IZQUIERDO: La Carta */}
      <div className="md:w-2/3">
        
        <ListaProductos onAgregar={manejarAgregar} />
      </div>

      {/* LADO DERECHO: El Carrito */}
      <div className="md:w-1/3 bg-white p-5 rounded-xl shadow-md border border-gray-200 h-fit sticky top-4 mt-12 " >
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-orange-200 pb-2 mb-4">
          Comanda Actual
        </h2>
        
        {carrito.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Aún no hay productos en el pedido...</p>
        ) : (
          <ul className="mb-4 max-h-60 overflow-y-auto pr-2">
            {carrito.map((item, index) => (
              <li key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => manejarEliminar(index)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors font-bold"
                    title="Quitar del pedido"
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

        <div className="border-t-2 border-gray-100 pt-4 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-600">Total a pagar:</span>
            <span className="text-2xl font-bold text-yellow-500">
              ${totalCuenta.toLocaleString('es-CL')}
            </span>
          </div>
          
          {/* conecta la  función al botón */}
          <button 
            onClick={manejarConfirmar}
            className="w-full mt-4 bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
      
    </div>
  );
}