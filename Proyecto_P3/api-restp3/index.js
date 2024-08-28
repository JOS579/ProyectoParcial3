import express from 'express'; // Importa el framework Express para crear el servidor web
import mysql from 'mysql2'; // Importa mysql2 para conectarse a la base de datos MySQL
import bodyParser from 'body-parser'; // Importa bodyParser para manejar datos JSON en las solicitudes
import cors from 'cors'; // Importa cors para permitir solicitudes desde otros dominios
// Inicializa la aplicación Express
const app = express();
// Configura middlewares para que la aplicación pueda interpretar JSON y manejar CORS
app.use(bodyParser.json());
app.use(cors());
// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'bd_calificaciones'
});
// Establece la conexión con la base de datos MySQL
db.connect(error => {
    if (error) {
        console.log("Error al establecer la conexion");
        return;
    }
    console.log("Conexion exitosa");
});
// Inicia el servidor en el puerto 5000
app.listen(5000, () => {
    console.log("Server listening on Port 5000");
});
// Ruta raíz para verificar el funcionamiento del servidor
app.get("/", (req, res) => {
    res.send("Bienvenidos a mi API");
});

// CRUD para estudiantes
//Obtener estudiantes
app.get("/estudiantes", (req, res) => {
    const query = "SELECT * FROM estudiante";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error al recibir datos');
            return;
        }
        res.status(200).json(results);
    });
});
//Agregar estudiante
app.post("/estudiantes", (req, res) => {
    const { nombre, apellido, numero_identificacion } = req.body;
    const query = "INSERT INTO estudiante(nombre, apellido, numero_identificacion) VALUES(?,?,?)";
    db.query(query, [nombre, apellido, numero_identificacion], (error, results) => {
        if (error) {
            res.status(500).json('Error al registrar el estudiante');
            return;
        }
        res.status(200).json(`Estudiante registrado con el ID: ${results.insertId}`);
    });
});
//Actualizar Estudiante
app.put("/estudiantes/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, numero_identificacion } = req.body;
    const query = "UPDATE estudiante SET nombre = ?, apellido = ?, numero_identificacion = ? WHERE id_estudiante = ?";

    db.query(query, [nombre, apellido, numero_identificacion, id], (error, results) => {
        if (error) {
            res.status(500).json('Error al actualizar el estudiante');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Estudiante no encontrado');
            return;
        }
        res.status(200).json(`Estudiante con ID: ${id} actualizado correctamente`);
    });
});
//Borrar Estudiante
app.delete("/estudiantes/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM estudiante WHERE id_estudiante = ?";

    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json('Error al eliminar el estudiante');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Estudiante no encontrado');
            return;
        }
        res.status(200).json(`Estudiante con ID: ${id} eliminado correctamente`);
    });
});

// CRUD para materias
//Obtener materias
app.get("/materias", (req, res) => {
    const query = "SELECT * FROM materia";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error al recibir datos');
            return;
        }
        res.status(200).json(results);
    });
});
//Agregar Materia
app.post("/materias", (req, res) => {
    const { nombre_materia } = req.body;
    const query = "INSERT INTO materia(nombre_materia) VALUES(?)";
    db.query(query, [nombre_materia], (error, results) => {
        if (error) {
            res.status(500).json('Error al registrar la materia');
            return;
        }
        res.status(200).json(`Materia registrada con el ID: ${results.insertId}`);
    });
});
//Actulizar materia
app.put("/materias/:id", (req, res) => {
    const { id } = req.params;
    const { nombre_materia } = req.body;
    const query = "UPDATE materia SET nombre_materia = ? WHERE id_materia = ?";

    db.query(query, [nombre_materia, id], (error, results) => {
        if (error) {
            res.status(500).json('Error al actualizar la materia');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Materia no encontrada');
            return;
        }
        res.status(200).json(`Materia con ID: ${id} actualizada correctamente`);
    });
});
//Eliminar Materia
app.delete("/materias/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM materia WHERE id_materia = ?";

    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json('Error al eliminar la materia');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Materia no encontrada');
            return;
        }
        res.status(200).json(`Materia con ID: ${id} eliminada correctamente`);
    });
});
// CRUD para calificaciones
// Obtener calificaciones
app.get("/calificaciones", (req, res) => {
    const query = "SELECT * FROM calificacion";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error al recibir datos');
            return;
        }
        res.status(200).json(results);
    });
});

// Agregar calificación
app.post("/calificaciones", (req, res) => {
    const { estudianteId, materiaId, nota } = req.body;
    const query = "INSERT INTO calificacion (estudianteId, materiaId, nota) VALUES (?, ?, ?)";
    db.query(query, [estudianteId, materiaId, nota], (error, results) => {
        if (error) {
            res.status(500).json('Error al agregar la calificación');
            return;
        }
        res.status(201).json(`Calificación agregada con ID: ${results.insertId}`);
    });
});

// Actualizar calificación
app.put("/calificaciones/:id", (req, res) => {
    const { id } = req.params;
    const { estudianteId, materiaId, nota } = req.body;
    const query = "UPDATE calificacion SET estudianteId = ?, materiaId = ?, nota = ? WHERE id = ?";
    db.query(query, [estudianteId, materiaId, nota, id], (error, results) => {
        if (error) {
            res.status(500).json('Error al actualizar la calificación');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Calificación no encontrada');
            return;
        }
        res.status(200).json(`Calificación con ID: ${id} actualizada correctamente`);
    });
});

// Eliminar calificación
app.delete("/calificaciones/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM calificacion WHERE id = ?";
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json('Error al eliminar la calificación');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Calificación no encontrada');
            return;
        }
        res.status(200).json(`Calificación con ID: ${id} eliminada correctamente`);
    });
});
// CRUD para matrículas
// Obtener matrículas
app.get("/matriculas", (req, res) => {
    const query = "SELECT * FROM matricula";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error al recibir datos');
            return;
        }
        res.status(200).json(results);
    });
});

// Agregar matrícula
app.post("/matriculas", (req, res) => {
    const { estudianteId, materias } = req.body;
    const query = "INSERT INTO matricula (estudianteId, materias) VALUES (?, ?)";
    db.query(query, [estudianteId, JSON.stringify(materias)], (error, results) => {
        if (error) {
            res.status(500).json('Error al agregar la matrícula');
            return;
        }
        res.status(201).json(`Matrícula agregada con ID: ${results.insertId}`);
    });
});

// Eliminar matrícula 
app.delete("/matriculas/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM matricula WHERE id = ?";
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json('Error al eliminar la matrícula');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json('Matrícula no encontrada');
            return;
        }
        res.status(200).json(`Matrícula con ID: ${id} eliminada correctamente`);
    });
});

// CRUD para reportes
// Endpoint para guardarreportes
app.post('/reporte', (req, res) => {
    const reportes = req.body;

    reportes.forEach(reporte => {
        const { id_estudiante, promedio } = reporte;
        const query = `
            INSERT INTO reportes (id_estudiante, promedio)
            VALUES (?, ?)
        `;
        db.query(query, [id_estudiante, promedio], (err, result) => {
            if (err) {
                res.status(500).json('Error al guardar el reporte');
                return;
            }
        });
    });

    res.status(200).json('Reportes guardados correctamente');
});
