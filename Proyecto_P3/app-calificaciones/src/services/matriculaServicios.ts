import { Matricula } from "../interfaces/Matricula";

// Obtener todas las matriculaciones
export const getMatriculas = async (): Promise<Matricula[]> => {
    try {
        const response = await fetch('http://localhost:5000/matriculas');
        if (!response.ok) {
            throw new Error(`No se pudo obtener las matriculaciones: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener las matriculaciones:", error);
        throw error;
    }
}

// Crear una nueva matriculación
export const createMatricula = async (matricula: Matricula): Promise<Matricula> => {
    try {
        const response = await fetch('http://localhost:5000/matriculas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matricula)
        });
        if (!response.ok) {
            throw new Error(`No se pudo crear la matriculación: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al crear la matriculación:", error);
        throw error;
    }
}

// Eliminar una matriculación
export const deleteMatricula = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:5000/matriculas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`No se pudo eliminar la matriculación: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error al eliminar la matriculación:", error);
        throw error;
    }
}