
const sectionInsert = document.querySelector(".insert")
const sectionUpdate = document.querySelector(".update")
sectionInsert.style.display = "block"
sectionUpdate.style.display = "none"


function eliminarTravel(id) {
    //console.log(id);
    fetch(`/delete/${id}`, 
        {
            method: "DELETE"
        })
        .then( response => response.json())
        .then( setTimeout(() => location.reload(), 300))
        .catch( error => console.error("Error:", error))
}

function mostrarFormularioActualizacion(travel) {
    sectionInsert.style.display = "none"
    sectionUpdate.style.display = "block"
    
    travel = JSON.parse(travel)
    // console.log(travel.nombre);
    document.getElementById('up_id').value = travel.id
    document.getElementById('up_ruta').value = travel.ruta
    document.getElementById('up_lugar').value = travel.lugar
    document.getElementById('up_nombre').value = travel.nombre
    document.getElementById('up_descripcion').value = travel.descripcion
    document.getElementById('up_precio').value = travel.precio
    document.getElementById('up_imagen').value = travel.img
}