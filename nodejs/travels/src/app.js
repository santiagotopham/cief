// Cargar los módulos para poderlos utilizar
const express = require('express')
const path = require('node:path')

// Crear la instancia del servidor
const app = express()

// Configurar algunos parámetros
process.loadEnvFile()
PORT = process.env.PORT
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '../static')))

// Ruta raíz o inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../static', "prueba.html"))
})

app.listen(PORT, () => {
    console.log(`Servidor arrancado en http://localhost:${PORT}`);
})