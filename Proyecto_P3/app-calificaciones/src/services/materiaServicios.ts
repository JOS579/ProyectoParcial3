
import { Materia } from "../interfaces/Materia";

//Obtener materias
export const getMaterias = async (): Promise<Materia[]> => {
    try {
        const response = await fetch('http://localhost:5000/materias');
        if (!response.ok) {
            throw new Error(`No se pudo obtener las materias: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("export const getMaterias dice:", error);
        throw error;
    }
}

//Crear Materia
export const createMateria = async (materia: Omit<Materia, 'id'>) => {
    try {
        const response = await fetch('http://localhost:5000/materias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(materia)
        });
        if (!response.ok) {
            throw new Error(`No se pudo crear la materia: ${response.statusText}`);
        }
    } catch (error) {
        console.error("export const createMateria dice:", error);
        throw error;
    }
}
//Actualizar materia
export const updateMateria = async (materia: Omit<Materia, 'id'>, id: number) => {
    try {
        const response = await fetch(`http://localhost:5000/materias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(materia)
        });
        if (!response.ok) {
            throw new Error(`No se pudo actualizar la materia: ${response.statusText}`);
        }
    } catch (error) {
        console.error("export const updateMateria dice:", error);
        throw error;
    }
}
//Borrar materia
export const deleteMateria = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:5000/materias/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`No se pudo eliminar la materia: ${response.statusText}`);
        }
    } catch (error) {
        console.error("export const deleteMateria dice:", error);
        throw error;
    }
}