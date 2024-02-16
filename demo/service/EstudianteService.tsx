import { Demo } from '../../types/types';

export const EstudianteService = {
    async getEstudiantes() {
        try {
            const response = await fetch('http://localhost:1010/getEstudiantes');
            const data = await response.json();
            return data as Demo.Curso[];
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    },
    async createEstudiante(estudiante: Demo.Estudiante) {
        try {
            const {id, ...newCurso } = estudiante
            const response = await fetch('http://localhost:1010/postEstudiante', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8'
                 },
                body: JSON.stringify(newCurso)
            });
            const data = await response.json();
            return data
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    },
    async updateEstudiante(estudiante: Demo.Estudiante) {
        try {
            const response = await fetch('http://localhost:1010/updateEstudiante/' + estudiante.id, {
                method: 'PUT',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8'
                 },
                body: JSON.stringify(estudiante)
            });
            const data = await response.json();
            return data
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    },
    async deleteEstudiante(estudiante: Demo.Estudiante) {
        try {
            console.log(estudiante);
            const response = await fetch('http://localhost:1010/deleteEstudiante/' + estudiante.id, {
                method: 'DELETE'
            });
            const data = await response.status;
            if (data == 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    }
};
