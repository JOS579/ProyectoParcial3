import { Reporte } from "../interfaces/Calificacion";
// Guardar reportes
export const guardarReporte = async (reportes: Reporte[]): Promise<void> => {
    try {
        await fetch('http://localhost:5000/reporte', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportes) 
        });
    } catch (error) {
        console.error("Error al guardar el reporte:", error);
        throw error;
    }
};