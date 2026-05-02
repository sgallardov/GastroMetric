import { useState } from 'react';

export function PantallaPago({ numeroMesa, totalCuenta, onCancelar, onConfirmar }) {
  // Lista de opciones de pago disponibles
  const OPCIONES_PAGO = ['Efectivo', 'Tarjeta de Débito', 'Tarjeta de Crédito', 'Transferencia'];

  // ESTADO DINÁMICO: Iniciamos con 1 fila por defecto (Efectivo y vacío)
  const [pagos, setPagos] = useState([
    { metodo: 'Efectivo', monto: '' }
  ]);

  // --- FUNCIONES DEL FORMULARIO DINÁMICO ---
  const agregarFila = () => {
    // Agrega una nueva fila al final
    setPagos([...pagos, { metodo: 'Tarjeta de Débito', monto: '' }]);
  };

  const eliminarFila = (indexAEliminar) => {
    // Evita que borren la última fila que queda
    if (pagos.length === 1) return alert("Debe existir al menos un método de pago.");
    setPagos(pagos.filter((_, index) => index !== indexAEliminar));
  };

  const actualizarFila = (index, campo, valor) => {
    const nuevosPagos = [...pagos];
    nuevosPagos[index][campo] = valor;
    setPagos(nuevosPagos);
  };

  // --- MATEMÁTICA ---
  // Sumamos todos los montos de todas las filas que existan
  const totalIngresado = pagos.reduce((suma, pago) => {
    const montoNumero = parseInt(pago.monto) || 0;
    return suma + montoNumero;
  }, 0);

  const saldoFaltante = Math.max(0, totalCuenta - totalIngresado);
  const vuelto = Math.max(0, totalIngresado - totalCuenta);
  const sePuedePagar = totalIngresado >= totalCuenta;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Caja - Mesa {numeroMesa}</h2>
          <p className="text-gray-500 text-sm">Registro de pagos</p>
        </div>
        <button 
          onClick={onCancelar}
          className="text-gray-400 hover:text-red-500 font-bold px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
        >
          Volver al pedido
        </button>
      </div>

      {/* Resumen del Total */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center border-2 border-dashed border-gray-200">
        <p className="text-gray-500 font-medium mb-1">Total a cobrar</p>
        <p className="text-5xl font-black text-gray-800">
          ${totalCuenta.toLocaleString('es-CL')}
        </p>
      </div>

      {/* --- FILAS DINÁMICAS DE PAGO --- */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        <div className="flex justify-between items-end mb-4">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
            Métodos Ingresados
          </label>
          <button 
            onClick={agregarFila}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            + Dividir Pago
          </button>
        </div>

        <div className="space-y-3">
          {pagos.map((pago, index) => (
            <div key={index} className="flex gap-2 items-center bg-white border border-gray-200 p-2 rounded-xl focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400 transition-all">
              
              {/* SELECTOR DE MÉTODO */}
              <select 
                value={pago.metodo}
                onChange={(e) => actualizarFila(index, 'metodo', e.target.value)}
                className="bg-transparent text-gray-700 font-semibold p-2 outline-none w-1/2 cursor-pointer"
              >
                {OPCIONES_PAGO.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>

              <div className="w-px h-8 bg-gray-200"></div> {/* Divisor visual */}

              {/* INPUT DEL MONTO */}
              <div className="flex items-center w-1/2 relative">
                <span className="text-gray-500 font-bold ml-3">$</span>
                <input 
                  type="number" 
                  placeholder="0"
                  value={pago.monto}
                  onChange={(e) => actualizarFila(index, 'monto', e.target.value)}
                  className="w-full bg-transparent p-2 outline-none font-bold text-lg text-right pr-4"
                />
              </div>

              {/* BOTÓN ELIMINAR FILA */}
              <button 
                onClick={() => eliminarFila(index)}
                className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg w-10 h-10 flex items-center justify-center font-bold transition-colors shrink-0"
                title="Quitar este pago"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados Dinámicos (Faltante o Vuelto) */}
      <div className="mt-auto bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total ingresado:</span>
          <span className="font-bold text-gray-800">${totalIngresado.toLocaleString('es-CL')}</span>
        </div>
        
        {saldoFaltante > 0 ? (
          <div className="flex justify-between items-center text-red-500">
            <span>Falta por pagar:</span>
            <span className="font-bold text-xl">${saldoFaltante.toLocaleString('es-CL')}</span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-green-600">
            <span>Vuelto a entregar:</span>
            <span className="font-bold text-2xl">${vuelto.toLocaleString('es-CL')}</span>
          </div>
        )}
      </div>

      {/* Botón Final */}
      <button 
        onClick={onConfirmar}
        disabled={!sePuedePagar}
        className={`w-full font-bold py-4 rounded-xl text-lg transition-all shadow-md ${
          sePuedePagar 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {sePuedePagar ? 'Confirmar Pago y Liberar Mesa' : 'Complete el pago para continuar'}
      </button>

    </div>
  );
}