// Importando las bibliotecas y componentes necesarios de React y PrimeReact
import React, { useEffect, useState, useRef } from "react";
import { Estudiante } from "../interfaces/Estudiante";
import { getEstudiantes, createEstudiante, updateEstudiante, deleteEstudiante } from "../services/estudianteServicios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

// Componente principal para la gestión de estudiantes
export const GestionEstudiantes: React.FC = () => {
  // Variables de estado para gestionar estudiantes y la visibilidad del diálogo
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [dlgEstudiante, setDlgEstudiante] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  // Obtener datos de los estudiantes cuando el componente se monta
  useEffect(() => {
    const fetchEstudiantes = async () => {
      const data = await getEstudiantes();
      setEstudiantes(data);
    }
    fetchEstudiantes();
  }, []);

  // Función para abrir el diálogo para agregar un nuevo estudiante
  const abrirNuevo = () => {
    setEstudiante(null);
    setDlgEstudiante(true);
  }

  // Función para confirmar la eliminación de un estudiante
  const confirmDeleteEstudiante = (estudiante: Estudiante) => {
    confirmDialog({
      message: `¿Está seguro de que desea eliminar el estudiante "${estudiante.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => delete1Estudiante(estudiante),
    });
  }

  // Función para registrar o actualizar un estudiante
  const registrarEstudiante = async () => {
    try {
      if (estudiante) {
        const estudianteExistente = estudiantes.find(e => e.numero_identificacion === estudiante.numero_identificacion);
        if (estudianteExistente && estudianteExistente.id_estudiante !== estudiante.id_estudiante) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'El estudiante ya está registrado' });
          return;
        }

        if (!estudiante.id_estudiante) {
          await createEstudiante(estudiante);
          toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Estudiante registrado' });
        } else {
          await updateEstudiante(estudiante, estudiante.id_estudiante);
          toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Estudiante actualizado' });
        }
        setDlgEstudiante(false);
        setEstudiante(null);
        setEstudiantes(await getEstudiantes());
      } else {
        throw new Error('El objeto estudiante no es válido');
      }
    } catch (error) {
      console.error("Error al guardar el estudiante:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el estudiante' });
    }
  }

  // Función para actualizar un estudiante
  const update1Estudiante = (estudiante: Estudiante) => {
    setEstudiante(estudiante);
    setDlgEstudiante(true);
  }

  // Función para eliminar un estudiante
  const delete1Estudiante = async (estudiante: Estudiante) => {
    await deleteEstudiante(estudiante.id_estudiante);
    toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Estudiante eliminado' });
    setEstudiantes(await getEstudiantes());
  }

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <h1>Gestión de Estudiantes</h1>
      <div style={{ marginBottom: '0.5cm' }}>
        <Button label="Nuevo" icon="pi pi-plus" onClick={abrirNuevo} />
      </div>
      <DataTable value={estudiantes} paginator rows={5} rowsPerPageOptions={[5, 10, 20]}>
        <Column field="id_estudiante" header="Id" sortable/>
        <Column field="nombre" header="Nombre" sortable/>
        <Column field="apellido" header="Apellido" sortable/>
        <Column field="numero_identificacion" header="Número de Identificación" sortable/>
        <Column body={(rowData) => (
          <div>
            <Button icon="pi pi-pencil" onClick={() => update1Estudiante(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteEstudiante(rowData)} />
          </div>
        )} />
      </DataTable>
      <Dialog
        visible={dlgEstudiante}
        style={{ width: "450px" }}
        header="Detalle de Estudiante"
        modal
        onHide={() => setDlgEstudiante(false)}
      >
        <div className="p-fluid">
          <label htmlFor="nombre">Nombre</label>
          <InputText
            id="nombre"
            value={estudiante?.nombre || ''}
            onChange={(e) => setEstudiante({ ...estudiante!, nombre: e.target.value })}
          />
        </div>
        
        <div className="p-fluid">
          <label htmlFor="apellido">Apellido</label>
          <InputText
            id="apellido"
            value={estudiante?.apellido || ''}
            onChange={(e) => setEstudiante({ ...estudiante!, apellido: e.target.value })}
          />
        </div>
        <div className="p-fluid">
          <label htmlFor="numero_identificacion">Número de Identificación</label>
          <InputText
            id="numero_identificacion"
            value={estudiante?.numero_identificacion || ''}
            onChange={(e) => setEstudiante({ ...estudiante!, numero_identificacion: e.target.value })}
          />
        </div>
        <Button label="Guardar" onClick={registrarEstudiante} />
      </Dialog>
    </div>
  );
}