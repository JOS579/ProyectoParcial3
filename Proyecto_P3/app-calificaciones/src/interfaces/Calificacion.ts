// Definición de interfaces para Calificacion y Reporte
export interface Calificacion {
    id: number;
    estudianteId: number;
    materiaId: number;
    nota: number;
}

export interface Reporte {
    id_reporte?: number;
    id_estudiante: number;
    promedio: number;
}