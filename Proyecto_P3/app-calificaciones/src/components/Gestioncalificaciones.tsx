// Importando las bibliotecas y componentes necesarios de React y PrimeReact
import React, { useEffect, useState, useRef } from "react";
import { Estudiante } from "../interfaces/Estudiante";
import { Materia } from "../interfaces/Materia";
import { Calificacion, Reporte } from "../interfaces/Calificacion";
import { Matricula } from "../interfaces/Matricula";
import { getEstudiantes } from "../services/estudianteServicios";
import { getMaterias } from "../services/materiaServicios";
import { getCalificaciones, createCalificacion, updateCalificacion, deleteCalificacion } from "../services/calificacionServicios";
import { getMatriculas } from "../services/matriculaServicios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { guardarReporte } from "../services/reporteServicios";
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import * as XLSX from 'xlsx';

export const GestionCalificaciones: React.FC = () => {
    // Variables de estado para gestionar datos y estado de la UI
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
    const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
    const [nota, setNota] = useState<number | null>(null);
    const [dlgCalificacion, setDlgCalificacion] = useState<boolean>(false);
    const [dlgReporte, setDlgReporte] = useState<boolean>(false);
    const [reporte, setReporte] = useState<any[]>([]);
    const toast = useRef<Toast>(null);

    // Obtener datos al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const estudiantesData = await getEstudiantes();
                const materiasData = await getMaterias();
                const calificacionesData = await getCalificaciones();
                const matriculasData = await getMatriculas();
                setEstudiantes(estudiantesData);
                setMaterias(materiasData);
                setCalificaciones(calificacionesData);
                setMatriculas(matriculasData);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' });
            }
        }
        fetchData();
    }, []);

    // Abrir diálogo para nueva calificación
    const abrirNuevo = () => {
        setSelectedEstudiante(null);
        setSelectedMateria(null);
        setNota(null);
        setDlgCalificacion(true);
    }

    // Verificar si un estudiante ya ha sido calificado en una materia
    const materiaYaCalificada = (estudianteId: number, materiaId: number) => {
        return calificaciones.some(cal => cal.estudianteId === estudianteId && cal.materiaId === materiaId);
    }

    // Validar si la nota es válida
    const esNotaValida = (nota: number): boolean => {
        return !isNaN(nota) && nota >= 0 && nota <= 20 && /^\d+(\.\d+)?$/.test(nota.toString());
    };

    // Validar la calificación antes de guardarla
    const validarCalificacion = () => {
        if (!selectedEstudiante || !selectedMateria || nota === null) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un estudiante, una materia y asignar una nota' });
            return false;
        }

        if (!esNotaValida(nota)) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'La nota debe ser entre 0 y 20' });
            return false;
        }

        return true;
    }

    // Registrar o actualizar una calificación
    const registrarCalificacion = async () => {
        if (!validarCalificacion()) {
            return;
        }
    
        try {
            const calificacionExistente = calificaciones.find(cal => cal.estudianteId === selectedEstudiante!.id_estudiante && cal.materiaId === selectedMateria!.id_materia);
    
            if (calificacionExistente) {
                calificacionExistente.nota = nota!;
                await updateCalificacion(calificacionExistente.id, calificacionExistente); 
                toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Calificación actualizada' });
            } else {
                const nuevaCalificacion: Calificacion = {
                    id: calificaciones.length + 1,
                    estudianteId: selectedEstudiante!.id_estudiante,
                    materiaId: selectedMateria!.id_materia,
                    nota: nota!
                };
                await createCalificacion(nuevaCalificacion);
                toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Calificación registrada' });
            }

            setDlgCalificacion(false);
            setCalificaciones(await getCalificaciones());
        } catch (error) {
            console.error("Error al registrar la calificación:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la calificación' });
        }
    }

    // Confirmar eliminación de una calificación
    const confirmDeleteCalificacion = (calificacion: Calificacion) => {
        confirmDialog({
            message: `¿Está seguro de que desea eliminar la calificación?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => eliminarCalificacion(calificacion.id),
        });
    }

    // Eliminar una calificación
    const eliminarCalificacion = async (id: number) => {
        try {
            await deleteCalificacion(id);
            toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Calificación eliminada' });
            setCalificaciones(await getCalificaciones());
        } catch (error) {
            console.error("Error al eliminar la calificación:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la calificación' });
        }
    }

    // Obtener materias matriculadas por un estudiante
    const getMateriasMatriculadas = (estudianteId: number) => {
        const matricula = matriculas.find(m => m.estudianteId === estudianteId);
        if (!matricula) return [];
        return materias.filter(mat => matricula.materias.includes(mat.id_materia));
    }

    // Calcular el promedio de calificaciones
    const calcularPromedio = (calificaciones: Calificacion[], totalMaterias: number) => {
        if (totalMaterias === 0) return "0.00";
        
        const total = calificaciones.reduce((acc, cal) => acc + (isNaN(parseFloat(cal.nota.toString())) ? 0 : parseFloat(cal.nota.toString())), 0);
        const promedio = total / totalMaterias;
        
        return promedio.toFixed(2);
    }
 
    // Generar reporte de calificaciones
    const generarReporte = () => {
        const reporteData = estudiantes.map((est, index) => {
            const calificacionesEstudiante = calificaciones.filter(cal => cal.estudianteId === est.id_estudiante);
            const materiasMatriculadas = getMateriasMatriculadas(est.id_estudiante);
            const totalMaterias = materiasMatriculadas.length;

            const promedio = calcularPromedio(calificacionesEstudiante, totalMaterias);

            const materiasConNotas = materiasMatriculadas.map(mat => {
                const calificacion = calificacionesEstudiante.find(cal => cal.materiaId === mat.id_materia);
                return {
                    materia: mat.nombre_materia,
                    nota: calificacion ? calificacion.nota : 0
                };
            });

            return {
                id_reporte: index + 1,  
                id_estudiante: est.id_estudiante,
                estudiante: est.nombre,
                materias: materiasConNotas,
                promedio: isNaN(parseFloat(promedio)) ? "0.00" : promedio
            };
        });

        setReporte(reporteData);
        setDlgReporte(true);
    }

    // Exportar reporte a Excel
    const exportarExcel = () => {
        const datosFiltrados = reporte.map(({ id_estudiante, estudiante, promedio }) => ({
            id_estudiante,
            estudiante,
            promedio
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(datosFiltrados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    
        XLSX.writeFile(workbook, "reporte_calificaciones.xlsx");
    }
              
    // Enviar datos del reporte
        const enviarDatos = async () => {
        try {
            // Preparar los datos del reporte final para ser enviados
            const reporteFinal: Reporte[] = reporte.map((item) => ({
                id_reporte: item.id_reporte,
                id_estudiante: item.id_estudiante,
                promedio: parseFloat(item.promedio)
            }));
    
            // Enviar los datos del reporte al servidor
            await guardarReporte(reporteFinal);
            toast.current?.show({ severity: 'success', summary: 'Operación exitosa', detail: 'Datos enviados correctamente' });
        } catch (error) {
            console.error('Error al enviar los reportes:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron enviar los datos' });
        }
    };
    
    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <h1>Gestión de Calificaciones</h1>
            <div style={{ marginBottom: '0.5cm', textAlign: 'center' }}>
                <Button label="Nueva Calificación" icon="pi pi-plus" onClick={abrirNuevo} style={{ marginRight: '1cm' }} />
                <Button label="Generar Reporte" icon="pi pi-file" onClick={generarReporte} className="p-ml-2" />
            </div>
            {calificaciones.length === 0 ? (
                <p>No hay calificaciones registradas.</p>
            ) : (
                <DataTable value={calificaciones} paginator rows={5} rowsPerPageOptions={[5, 10, 20]}>
                    <Column field="estudianteId" header="ID Estudiante" sortable />
                    <Column field="estudianteId" header="Estudiante" sortable body={(rowData) => {
                        const estudiante = estudiantes.find(est => est.id_estudiante === rowData.estudianteId);
                        return estudiante ? estudiante.nombre : "Desconocido";
                    }} />
                    <Column field="materiaId" header="Materia" sortable body={(rowData) => {
                        const materia = materias.find(mat => mat.id_materia === rowData.materiaId);
                        return materia ? materia.nombre_materia : "Desconocido";
                    }} />
                    <Column field="nota" header="Nota" sortable/>
                    <Column header="Acciones" body={(rowData) => (
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteCalificacion(rowData)} />
                    )} />
                </DataTable>
            )}
            <Dialog
                visible={dlgCalificacion}
                style={{ width: "450px" }}
                header="Detalle de Calificación"
                modal
                onHide={() => setDlgCalificacion(false)}
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
                    <label htmlFor="materia">Materia</label>
                    <select
                        id="materia"
                        value={selectedMateria?.id_materia || ''}
                        onChange={(e) => setSelectedMateria(materias.find(mat => mat.id_materia === parseInt(e.target.value)) || null)}
                    >
                        <option value="">Seleccione una materia</option>
                        {getMateriasMatriculadas(selectedEstudiante?.id_estudiante || 0).map(mat => (
                            <option key={mat.id_materia} value={mat.id_materia}>{mat.nombre_materia}</option>
                        ))} 
                    </select>
                </div>
                <div className="p-fluid">
                    <label htmlFor="nota">Nota</label>
                    <InputNumber
                        id="nota"
                        value={nota}
                        onValueChange={(e) => setNota(e.value || null)}
                        mode="decimal"
                        minFractionDigits={1}
                        maxFractionDigits={2}
                        showButtons
                        useGrouping={false}
                    />
                </div>
                <Button label="Guardar" icon="pi pi-check" onClick={registrarCalificacion} />
            </Dialog>
            <Dialog
                visible={dlgReporte}
                style={{ width: "600px" }}
                header="Reporte Final"
                modal
                onHide={() => setDlgReporte(false)}
            >
                <DataTable value={reporte} paginator rows={5} rowsPerPageOptions={[5, 10, 20]}>
                    <Column field="id_estudiante" header="ID Estudiante"/>
                    <Column field="estudiante" header="Estudiante" />
                    <Column field="materias" header="Materias" body={(rowData) => (
                        <ul>
                            {rowData.materias.map((mat: any, index: number) => (
                                <li key={index}>{mat.materia}: {mat.nota}</li>
                            ))}
                        </ul>
                    )} />
                    <Column field="promedio" header="Promedio" />
                </DataTable>
                <div style={{ marginBottom: '0.5cm', textAlign: 'center'}}>
                    <Button label="Exportar a Excel" icon="pi pi-file-excel" onClick={exportarExcel} className="p-ml-2" style={{ marginRight: '1cm' }} />
                    <Button label="Enviar Datos" icon="pi pi-send" onClick={enviarDatos} className="p-ml-2" />
                </div>
            </Dialog>
        </div>
    );
}