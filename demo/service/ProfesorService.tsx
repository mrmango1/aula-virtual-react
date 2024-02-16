import { Demo } from '../../types/types';

export const ProfesorService = {
    async getProfesores() {
        try {
            const response = await fetch('http://localhost:1010/getProfesores');
            const data = await response.json();
            return data as Demo.Profesor[];
        } catch (error) {
            console.error('Error al obtener profesores:', error);
            throw error;
        }
    },
    async createProfesor(profesor: Demo.Profesor) {
        try {
            const { id, ...newCurso } = profesor;
            const response = await fetch('http://localhost:1010/postProfesor', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(newCurso)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    },
    async updateProfesor(profesor: Demo.Profesor) {
        try {
            const response = await fetch('http://localhost:1010/updateProfesor/' + profesor.id, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(profesor)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    },
    async deleteProfesores(profesor: Demo.Profesor) {
        try {
            console.log(profesor);
            const response = await fetch('http://localhost:1010/deleteProfesor/' + profesor.id, {
                method: 'DELETE'
            });
            const data = await response.status;
            if (data == 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al eliminar el profesor:', error);
            throw error;
        }
    }
};
