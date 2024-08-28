import React from 'react';

// Define un componente funcional llamado Inicio.
export const Inicio: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Universidad de las Fuerzas Armadas ESPE</h1>
      <h2>Proyecto Parcial 3</h2>
      <img 
        src="https://www.espe-innovativa.edu.ec/wp-content/uploads/enlaces/espe.png" 
        alt="Universidad de las Fuerzas Armadas ESPE" 
        style={{ width: '500px', height: 'auto', margin: '20px 0', backgroundColor: 'white' }} 
      />
      <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '20px 0' }}>Integrantes:</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>

        <li style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>Josseph Cedeño</li>
        <li style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>Alisson Tamayo</li>
        <li style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>Annthony Chavez</li>
        <li style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>Merlyn Ulcuango</li>
      </ul>
    </div>
  );
};