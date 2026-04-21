import { useState } from 'react';
import { ProductCard } from './ProductCard';
import productosData from '../mocks/productos.json';

export function ListaProductos({ onAgregar }) {
  // 1. ESTADOS: Memoria para lo que se escribe y selecciona
  const [busqueda, setBusqueda] = useState(''); //crea memoria en blanco para guardar lo que el garzón escriba en la barra de búsqueda
  const [categoriaActiva, setCategoriaActiva] = useState('Todos'); //crea otra memoria para saber qué botón está presionado, por defecto esta en "Todos" para que la carta se vea completa al entrar

  //categorías que aparecerán en los botones
  const categorias = ['Todos', 'Desayunos', 'Bebidas', 'Postres', 'Pastelería'];

  // 2. LÓGICA DE FILTRADO
  const productosFiltrados = productosData.filter((producto) => { //función de JS que revisa lista(productosData) y devuelve solo con los elementos que pasen una prueba

    const coincideTexto = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()); //Filtro 1: Convierte todo a minúsculas y revisa si la palabra escrita está dentro del nombre del producto.
    
    const coincideCategoria = categoriaActiva === 'Todos' || producto.categoria === categoriaActiva; //Filtro 2: ¿La categoría del producto coincide con el botón presionado? (O si estamos en "Todos")
    
    return coincideTexto && coincideCategoria;  //el producto solo se mostrará si cumple AMBAS condiciones a la vez coincideTexto y coincideCategoria
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">
        Catálogo de Productos
      </h2>

      {/* BARRA DE BÚSQUEDA */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="🔍 Buscar productos..." 
          value={busqueda} //input es de solo lectura y refleja estrictamente el valor de la variable de estado 'busqueda'
          onChange={(e) => setBusqueda(e.target.value)} //Actualiza la memoria cada vez que se presiona una tecla
          className="w-full bg-gray-100 text-gray-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
        />
      </div>

      {/* BOTONES DE CATEGORÍAS */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
        {/*se itera sobre el arreglo 'categorias' para generar los botones automáticamente */}
        {categorias.map((cat) => ( 
          <button
          // 'key' es obligatorio en React al usar .map() para optimizar el rendimiento del renderizado
            key={cat}
            // Al hacer clic, actualizamos la variable de estado global con la categoría de este botón
            onClick={() => setCategoriaActiva(cat)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${
              categoriaActiva === cat //verifica si la categoría almacenada en la memoria de React es igual a la categoría de este botón en particular
                ? 'bg-white text-yellow-500 shadow-sm' // Estilo si está activo
                : 'text-gray-500 hover:text-gray-700' // Estilo si está inactivo
            }`}
          >
            {/* Imprimimos el nombre de la categoría en la interfaz */}
            {cat}
          </button>
        ))}
      </div>
      
      {/* GRILLA DE PRODUCTOS */}
      {/* se verifica la cantidad de productos en lista ya filtrada */}
      {productosFiltrados.length === 0 ? (
        //0 productos: se muestra el Empty State para evitar pantalla en blanco
        <div className="text-center py-10 text-gray-500">
          No se encontraron productos que coincidan con tu búsqueda.
        </div>
      ) : (
        //si hay 1 o más productos: muestra la grilla interactiva
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/*se itera sobre la lista filtrada*/}
          {productosFiltrados.map((prod) => (
            <ProductCard
              key={prod.id}         // Identificador único obligatorio para React
              producto={prod}       // Enviamos los datos (nombre, precio) a la tarjeta.
              onAgregar={onAgregar} 
              
            />
          ))}
        </div>
      )}
    </div> 
  );
}