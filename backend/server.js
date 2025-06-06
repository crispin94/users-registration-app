// aqu ponemos todas las imports
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const DB_PATH = './db.json';

app.use(cors());
app.use(bodyParser.json());

// obtener usuarios
app.get('/api/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(data.users);
});

// agregar usuario
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    data.users.push(newUser);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(newUser);
});

//     ¿Editar usuario
app.put('/api/users/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const updatedUser = req.body;
    const data = JSON.parse(fs.readFileSync(DB_PATH));

    if (data.users[index]) {
        data.users[index] = updatedUser;
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        res.json(updatedUser);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

// Eliminar usuarioss
app.delete('/api/users/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    data.users = data.users || [];
    if (data.users[index]) {
        const deletedUser = data.users.splice(index, 1);
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        res.json(deletedUser);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

app.listen(3001, () => {
    console.log('Servidor backend en http://localhost:3001');
});
