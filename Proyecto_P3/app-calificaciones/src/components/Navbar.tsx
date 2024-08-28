import { Menubar } from 'primereact/menubar'; // Importa el componente Menubar de la biblioteca PrimeReact.
import React from 'react'; // Importa React para poder utilizar JSX y otros hooks.
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate de react-router-dom para la navegación.

// Define un componente funcional llamado Navbar.
export const Navbar: React.FC = () => {
  const navigate = useNavigate();// Utiliza el hook useNavigate para obtener una función de navegación.
// Define los elementos del menú con etiquetas, iconos y comandos de navegación.
  const items = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Estudiantes',
      icon: 'pi pi-user',
      command: () => navigate('/estudiantes')
    },
    {
      label: 'Materias',
      icon: 'pi pi-book',
      command: () => navigate('/materias')
    },
    {
      label: 'Matriculas',
      icon: 'pi pi-pencil',
      command: () => navigate('/matriculas')
    },
    {
      label: 'Calificaciones',
      icon: 'pi pi-chart-bar',
      command: () => navigate('/calificaciones')
    }
    
   
  ];

  return (
    <div>
      <div className="card">
        <Menubar model={items} />
      </div>
    </div>
  );
}