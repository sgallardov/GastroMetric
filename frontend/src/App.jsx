// 1. IMPORTACIONES
import React from 'react';
// Importamos el componente visual que acabamos de crear
import MapaMesas from './components/MapaMesas';

function App() {
  // 2. RENDERIZADO DEL ESQUELETO DE LA PÁGINA
  return (
    // Contenedor "Raíz":
    // min-h-screen asegura que el fondo gris ocupe siempre al menos el 100% de la altura de la pantalla
    <div className="min-h-screen bg-gray-200 p-8">
      
      {/* Contenedor centralizado: 
          max-w-5xl limita el ancho máximo para que no se estire demasiado en monitores gigantes.
          mx-auto centra automáticamente este contenedor en el medio de la pantalla. */}
      <div className="max-w-5xl mx-auto">
        
        {/* Aquí es donde "llamamos" o "montamos" nuestro componente.
            React tomará todo el código de MapaMesas.jsx y lo inyectará exactamente en esta línea. */}
        <MapaMesas />
        
      </div>
    </div>
  );
}

// Exportamos App para que el archivo principal de Vite (main.jsx) lo inicie
export default App;