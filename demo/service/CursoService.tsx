import { Demo } from '../../types/types';

export const CursoService = {
    async getCursos() {
        try {
            const response = await fetch('http://localhost:1010/getCursos');
            const data = await response.json();
            return data as Demo.Curso[];
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    },
    async createCurso(curso: Demo.Curso) {
        try {
            const {id, ...newCurso } = curso
            const response = await fetch('http://localhost:1010/postCurso', {
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
    async updateCurso(curso: Demo.Curso) {
        try {
            const response = await fetch('http://localhost:1010/updateCurso/' + curso.id, {
                method: 'PUT',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8'
                 },
                body: JSON.stringify(curso)
            });
            const data = await response.json();
            return data
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            throw error;
        }
    },
    async deleteCurso(curso: Demo.Curso) {
        try {
            console.log(curso);
            const response = await fetch('http://localhost:1010/deleteCurso/' + curso.id, {
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
