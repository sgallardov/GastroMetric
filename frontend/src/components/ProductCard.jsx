// Recibe 2 props: los datos del JSON 'producto' y la función 'onAgregar' que se creo en TomaDePedidos.jsx
//Esta es la creacion de la funcion PRODUCTO, que se utiliza en TomaDePedidos
export function ProductCard({ producto, onAgregar }) {
  //Todo lo que se vera en pantalla
    return ( 
    //Contenedor de los productos
    // flex-col y justify-between aseguran que el botón siempre quede pegado al fondo
    <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white flex flex-col justify-between">
        {/*Datos de JSON, informacion del producto*/}
      <div> 
        <h3 className="font-bold text-lg text-gray-800">{producto.nombre}</h3>  {/*Las llaves le dicen a react que es codigo de JS*/}
        <p className="text-gray-500 text-sm my-1">{producto.descripcion}</p>    {/*Extrae el nombre y descripcion del ítem desde el JSON*/}
        <p className="text-yellow-500 font-bold mt-2 text-xl">
          ${producto.precio.toLocaleString('es-CL')}  {/*Toma el número del JSON, muestra el precio formateado a moneda chilena(ej. 2.500)*/}
        </p>
      </div>
      
      {/*Boton para agregar un producto*/}
      {/*onClick Es el "escuchador" de eventos, reacciona cuando se le hace click*/}
      <button 
      // Al hacer clic, se envia ESTE producto específico a la función del carrito
        onClick={() => onAgregar(producto)}  
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors font-medium"
      >
        Agregar al pedido
      </button>
    </div>
  );
}