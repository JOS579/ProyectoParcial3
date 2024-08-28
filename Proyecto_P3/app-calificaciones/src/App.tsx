import React from 'react';
import './App.css';
// Importa los componentes BrowserRouter, Routes y Route desde la biblioteca 'react-router-dom'.
// BrowserRouter se renombra como Router para facilitar su uso en el código.
// Estos componentes se utilizan para configurar la navegación y las rutas en una aplicación React.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//Importaciones necesarias de los components
import { Navbar } from './components/Navbar';
import { GestionEstudiantes } from './components/Gestionestudiantes';
import { GestionMaterias } from './components/Gestionmateria';
import { GestionMatriculas } from './components/Gestionmatricula';
import { GestionCalificaciones } from './components/Gestioncalificaciones';
import { Inicio } from './components/Inicio';
import { Footer } from './components/footer';

const App: React.FC = () => {
  return (
    // Configuración de la navegación de la aplicación utilizando react-router-dom
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/estudiantes" element={<GestionEstudiantes />} />
          <Route path="/materias" element={<GestionMaterias />} />
          <Route path="/matriculas" element={<GestionMatriculas />} />
          <Route path="/calificaciones" element={<GestionCalificaciones />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;