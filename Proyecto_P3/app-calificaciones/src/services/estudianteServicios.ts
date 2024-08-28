import { Estudiante } from "../interfaces/Estudiante";

//Obtener estudiantes
export const getEstudiantes = async (): Promise<Estudiante[]> => {
    try {
        const response = await fetch('http://localhost:5000/estudiantes');
        if (!response.ok) {
            throw new Error(`No se pudo obtener los estudiantes: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("export const getEstudiantes dice:", error);
        throw error;
    }
}
//Crear estudiante
export const createEstudiante = async (estudiante: Estudiante) => {
    try {
        const response = await fetch('http://localhost:5000/estudiantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudiante)
        });
        if (!response.ok) {
            throw new Error(`No se pudo crear el estudiante: ${response.statusText}`);
        }
    } catch (error) {
        console.error("export const createEstudiante dice:", error);
        throw error;
    }
}
//Actualizar estudiante por id
export const updateEstudiante = async (estudiante: Estudiante, id: number) => {
    try {
        const response = await fetch(`http://localhost:5000/estudiantes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudiante)
        });
        if (!response.ok) {
            throw new Error(`No se pudo actualizar el estudiante: ${response.statusText}`);
        }
    } catch (error) {
        console.error("export const updateEstudiante dice:", error);
        throw error;
    }
}
//Borrar estudiante por id
export const deleteEstudiante = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:5000/estudiantes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`No se pudo eliminar el estudiante: ${response.statusText}`);
        }
    } catch (error) {
        console.error("export const deleteEstudiante dice:", error);
        throw error;
    }
}