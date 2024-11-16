const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises; 

const app = express()

// Configuración básica
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/public", express.static(path.join(__dirname, "public")));

// Ruta para obtener el formulario
app.get('/', (req, res) => {
    res.render('pages/registro');
}); 
// Ruta para obtener la galeria
app.get('/galeria', (req, res) => {
    res.render('pages/galeria');
}); 
// Ruta para obtener casino
app.get('/casino', (req, res) => {
    res.render('pages/casino');
}); 


// Función para leer el archivo JSON
async function leerUsuarios() {
    try {
        const filePath = path.join(__dirname, 'data', 'usuarios.json');
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Función para guardar en el archivo JSON
async function guardarUsuarios(usuarios) {
    const filePath = path.join(__dirname, 'data', 'usuarios.json');
    await fs.writeFile(filePath, JSON.stringify(usuarios, null, 2));
}

// Ruta POST para procesar el registro
app.post('/registro', async (req, res) => {
    try {
        // Obtener datos del formulario
        const nuevoUsuario = {
            id: Date.now(), // ID único basado en timestamp
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password, // En producción, esto debería estar hasheado
            fechaRegistro: new Date().toISOString()
        };

        // Leer usuarios existentes
        const usuarios = await leerUsuarios();
        
        // Verificar si el email ya existe
        if (usuarios.some(user => user.email === nuevoUsuario.email)) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya está registrado'
            });
        }

        // Agregar nuevo usuario
        usuarios.push(nuevoUsuario);
        
        // Guardar en el archivo
        await guardarUsuarios(usuarios);

        res.json({
            success: true,
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error('Error al procesar el registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar el registro'
        });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

