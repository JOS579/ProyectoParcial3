// Importando las bibliotecas y componentes necesarios de React y PrimeReact
import React, { useEffect, useState, useRef } from "react";
import { Estudiante } from "../interfaces/Estudiante";
import { Materia } from "../interfaces/Materia";
import { Matricula } from "../interfaces/Matricula";
import { getEstudiantes } from "../services/estudianteServicios";
import { getMaterias } from "../services/materiaServicios";
import { getMatriculas, createMatricula, deleteMatricula } from "../services/matriculaServicios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export const GestionMatriculas: React.FC = () => {
    // Estados para almacenar datos de estudiantes, materias y matriculas
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
    const [selectedMaterias, setSelectedMaterias] = useState<Materia[]>([]);
    const [dlgMatricula, setDlgMatricula] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    // useEffect para cargar datos iniciales de estudiantes, materias y matriculas
    useEffect(() => {
        const fetchData = async () => {
            try {
                const estudiantesData = await getEstudiantes();
                const materiasData = await getMaterias();
                const matriculasData = await getMatriculas();
                setEstudiantes(estudiantesData);
                setMaterias(materiasData);
                setMatriculas(matriculasData);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' });
            }
        }
        fetchData();
    }, []);

    // Función para abrir el diálogo de nueva matriculación
    const abrirNuevo = () => {
        setSelectedEstudiante(null);
        setSelectedMaterias([]);
        setDlgMatricula(true);
    }

    // Función para registrar una nueva matriculación
    const registrarMatricula = async () => {
        if (!selectedEstudiante) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un estudiante' });
            return;
        }

        if (selectedMaterias.length < 3 || selectedMaterias.length > 5) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar entre 3 y 5 materias' });
            return;
        }

        if (matriculas.some(m => m.estudianteId === selectedEstudiante.id_estudiante)) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El estudiante ya está matriculado' });
            return;
        }

        try {
            const nuevaMatricula: Matricula = {
                id: matriculas.length + 1, // Generar un ID único
                estudianteId: selectedEstudiante.id_estudiante,
                materias: selectedMaterias.map(m => m.id_materia)
            };
            await createMatricula(nuevaMatricula);
            toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Matriculación registrada' });
            setDlgMatricula(false);
            setMatriculas(await getMatriculas());
        } catch (error) {
            console.error("Error al registrar la matriculación:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la matriculación' });
        }
    }

    // Función para confirmar la eliminación de una matriculación
    const confirmarEliminacion = (id: number) => {
        const matricula = matriculas.find(m => m.id === id);
        const estudiante = estudiantes.find(e => e.id_estudiante === matricula?.estudianteId);
        const nombreEstudiante = estudiante ? estudiante.nombre : "Desconocido";

        confirmDialog({
            message: `¿Está seguro de que desea eliminar la matrícula de ${nombreEstudiante}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => eliminarMatricula(id),
            reject: () => toast.current?.show({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada' })
        });
    }

    // Función para eliminar una matriculación
    const eliminarMatricula = async (id: number) => {
        try {
            await deleteMatricula(id);
            toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Matriculación eliminada' });
            setMatriculas(await getMatriculas());
        } catch (error) {
            console.error("Error al eliminar la matriculación:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la matriculación' });
        }
    }

    // Función para obtener los nombres de las materias a partir de sus IDs
    const obtenerNombresMaterias = (materiasIds: number[]): string => {
        if (!materiasIds || materiasIds.length === 0) {
            return "No hay materias seleccionadas";
        }

        const nombresMaterias = materias
            .filter(materia => materiasIds.includes(materia.id_materia))
            .map(materia => materia.nombre_materia);

        return nombresMaterias.length > 0 ? nombresMaterias.join(", ") : "No hay materias seleccionadas";
    }

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <h1>Gestión de Matriculaciones</h1>
            <div style={{ marginBottom: '0.5cm' }}>
            <Button label="Nueva Matriculación" icon="pi pi-plus" onClick={abrirNuevo} />
            </div>
            {matriculas.length === 0 ? (
                <p>No hay matriculas registradas.</p>
            ) : (
                <DataTable value={matriculas} paginator rows={10} rowsPerPageOptions={[5, 10, 20]}>
                    <Column field="id" header="ID Matrícula" sortable />
                    <Column field="estudianteId" header="Estudiante" sortable body={(rowData) => {
                        const estudiante = estudiantes.find(est => est.id_estudiante === rowData.estudianteId);
                        return estudiante ? estudiante.nombre : "Desconocido";
                    }} />
                    <Column field="materias" header="Materias" body={(rowData) => obtenerNombresMaterias(rowData.materias || [])} />
                    <Column header="Acciones" body={(rowData) => (
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmarEliminacion(rowData.id)} />
                    )} />
                </DataTable>
            )}
            <Dialog
                visible={dlgMatricula}
                style={{ width: "450px" }}
                header="Detalle de Matriculación"
                modal
                onHide={() => setDlgMatricula(false)}
            >
                <div className="p-fluid">
                    <label htmlFor="estudiante">Estudiante</label>
                    <select
                        id="estudiante"
                        value={selectedEstudiante?.id_estudiante || ''}
                        onChange={(e) => setSelectedEstudiante(estudiantes.find(est => est.id_estudiante === parseInt(e.target.value)) || null)}
                    >
                        <option value="">Seleccione un estudiante</option>
                        {estudiantes.map(est => (
                            <option key={est.id_estudiante} value={est.id_estudiante}>{est.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="p-fluid">
                    <label htmlFor="materias">Materias</label>
                    <MultiSelect
                        id="materias"
                        value={selectedMaterias}
                        options={materias}
                        onChange={(e) => setSelectedMaterias(e.value)}
                        optionLabel="nombre_materia"
                        placeholder="Seleccione entre 3 y 5 materias"
                    />
                </div>
                <Button label="Guardar" onClick={registrarMatricula} />
            </Dialog>
        </div>
    );
}