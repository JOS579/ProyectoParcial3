import React from 'react';
//Componenete funcional footer
export const Footer: React.FC = () => {
  return (
     // Etiqueta <footer> con estilos en línea
    <footer style={{ textAlign: 'center', padding: '10px 0', backgroundColor: '#f1f1f1', marginTop: '20px', color: 'black' }}>
      <p>&copy; {new Date().getFullYear()} Universidad de las Fuerzas Armadas ESPE. Todos los derechos reservados.</p>
    </footer>
  );
};