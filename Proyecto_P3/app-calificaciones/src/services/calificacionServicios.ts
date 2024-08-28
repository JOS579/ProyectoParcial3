import { Calificacion } from "../interfaces/Calificacion";

// Obtener todas las calificaciones
export const getCalificaciones = async (): Promise<Calificacion[]> => {
    try {
        const response = await fetch('http://localhost:5000/calificaciones');
        if (!response.ok) {
            throw new Error(`No se pudo obtener las calificaciones: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener las calificaciones:", error);
        throw error;
    }
}

// Crear una nueva calificación
export const createCalificacion = async (calificacion: Calificacion): Promise<Calificacion> => {
    try {
        const response = await fetch('http://localhost:5000/calificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(calificacion)
        });
        if (!response.ok) {
            throw new Error(`No se pudo crear la calificación: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al crear la calificación:", error);
        throw error;
    }
}

// Actualizar una calificación existente
export const updateCalificacion = async (id: number, calificacion: Calificacion): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:5000/calificaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(calificacion)
        });
        if (!response.ok) {
            throw new Error(`No se pudo actualizar la calificación: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error al actualizar la calificación:", error);
        throw error;
    }
}

// Eliminar una calificación
export const deleteCalificacion = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:5000/calificaciones/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`No se pudo eliminar la calificación: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error al eliminar la calificación:", error);
        throw error;
    }
}