// Importando las bibliotecas y componentes necesarios de React y PrimeReact
import React, { useEffect, useState, useRef } from "react";
import { Materia } from "../interfaces/Materia";
import { getMaterias, createMateria, updateMateria, deleteMateria } from "../services/materiaServicios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

// Componente principal para la gestión de materias
export const GestionMaterias: React.FC = () => {
  // Variables de estado para gestionar materias y la visibilidad del diálogo
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [materia, setMateria] = useState<Materia | null>(null);
  const [dlgMateria, setDlgMateria] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  // Obtener datos de las materias cuando el componente se monta
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const data = await getMaterias();
        console.log("Datos obtenidos:", data); // Agrega este console.log para depuración
        setMaterias(data);
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    }
    fetchMaterias();
  }, []);

  // Función para abrir el diálogo para agregar una nueva materia
  const abrirNuevo = () => {
    setMateria({ id_materia: 0, nombre_materia: '' }); 
    setDlgMateria(true);
  }

  // Función para registrar o actualizar una materia
  const registrarMateria = async () => {
    try {
      if (materia && materia.id_materia !== undefined) {
        const materiaExistente = materias.find(m => m.nombre_materia === materia.nombre_materia);
        if (materiaExistente) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'La materia ya existe' });
          return;
        }

        if (materia.id_materia === 0) {
          await createMateria(materia);
          toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Materia registrada' });
        } else {
          await updateMateria(materia, materia.id_materia);
          toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Materia actualizada' });
        }
        setDlgMateria(false);
        setMateria(null);
        setMaterias(await getMaterias());
      } else {
        throw new Error('El objeto materia no tiene un id válido');
      }
    } catch (error) {
      console.error("Error al guardar la materia:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la materia' });
    }
  }

  // Función para actualizar una materia
  const update1Materia = (materia: Materia) => {
    setMateria(materia);
    setDlgMateria(true);
  }

  // Función para confirmar la eliminación de una materia
  const confirmDeleteMateria = (materia: Materia) => {
    confirmDialog({
      message: `¿Está seguro de que desea eliminar la materia "${materia.nombre_materia}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => delete1Materia(materia),
    });
  }

  // Función para eliminar una materia
  const delete1Materia = async (materia: Materia) => {
    try {
      await deleteMateria(materia.id_materia);
      toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Materia eliminada' });
      setMaterias(await getMaterias());
    } catch (error) {
      console.error("Error al eliminar la materia:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la materia' });
    }
  }

  // Función para ocultar el diálogo
  const hideDialog = () => {
    setDlgMateria(false);
  }

  // Función para manejar los cambios en los campos de entrada
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _materia = { ...materia } as Materia;
    _materia = { ..._materia, [name]: val };
    setMateria(_materia);
  }

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <h1>Gestión de Materias</h1>
      <div className="card">
      <div style={{ marginBottom: '0.5cm' }}>
        <Button label="Nueva Materia" icon="pi pi-plus"  onClick={abrirNuevo} />
        </div>
        <DataTable value={materias} paginator rows={5} rowsPerPageOptions={[5, 10, 20]}>
          <Column field="id_materia" header="ID" sortable></Column>
          <Column field="nombre_materia" header="Nombre" sortable></Column>
          <Column body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" onClick={() => update1Materia(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteMateria(rowData)} />
            </>
          )}></Column>
        </DataTable>
      </div>

      <Dialog visible={dlgMateria} style={{ width: '450px' }} header="Detalles de Materia" modal className="p-fluid" footer={
        <>
          <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
          <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={registrarMateria} />
        </>
      } onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" value={materia?.nombre_materia} onChange={(e) => onInputChange(e, 'nombre_materia')} />
        </div>
      </Dialog>
    </div>
  );
}