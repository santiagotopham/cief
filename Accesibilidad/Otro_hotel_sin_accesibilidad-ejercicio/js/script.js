// Validación de posibles errores en nombres y/o apellido
let nombre = document.getElementById('nombre') 
let apellido = document.getElementById('apellido')

let errorNombre = document.getElementById('errorNombre')
let errorApellido = document.getElementById('errorApellido')

const mensajeErrorNombre = "<span>&#10006;</span> Hay que introducir un nombre válido"
const mensajeErrorApellido = "<span>&#10006;</span> Hay que introducir un apellido válido"

nombre.addEventListener('change', () => {
    const text = nombre.value.trim()
    if(text == 0) {
        errorNombre.innerHTML = mensajeErrorNombre
        
    }
})

apellido.addEventListener('change', () => {
    const text = apellido.value.trim()
    if(text == 0) {
        errorApellido.innerHTML = mensajeErrorApellido
        
    }
})