//mis elementos:
const selectHabilidad = document.getElementById('habilidad')
const povPreview = document.getElementById('pov-preview')
const mapPreview = document.getElementById('map-preview')
const inputHabilidad = document.getElementById('habilidad')
const formCrear = document.getElementById('form-crear')
const inputPov = document.getElementById('input-pov')
const inputMap = document.getElementById('input-map')
let povFilePegada = null;
let mapFilePegada = null;

function openModalPov() {
    // inputPov.click()
}

function openModalMap() {
    // inputMap.click()
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

var agentes = {}

const mostrarFecha = () => {
    const opcionesfecha = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }
    const fechaIntervaloSeg = setInterval(mostrarFecha, 1000)
    // fechaIntervaloMin = setInterval(mostrarFecha, 60000)
    const fechaHoy = new Date().toLocaleString('es-ES', opcionesfecha).replace(',', ' •')
    document.getElementById('fecha-hoy').innerHTML = fechaHoy
}
mostrarFecha()



fetch('data/agentes.json')
    .then(data => data.json())
    .then(data => {
        agentes = data

        agentes.map(agente => {
            let opcion = `<option value="${agente.nombre}">${capitalizeFirstLetter(agente.nombre)}</option>`
            document.getElementById('agente').innerHTML += opcion
        })
    })


function uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
}

document.getElementById('agente').addEventListener('change', event => {
    const agenteSeleccionado = event.target.value
    const indice = agentes.findIndex(obj => obj.nombre === agenteSeleccionado)
    const agente = agentes[indice]


    selectHabilidad.innerHTML = ""

    selectHabilidad.insertAdjacentHTML('beforeend', '<option value="">Elige una habilidad</option>')
    let opcion1 = `<option value="${agente.habilidades.h1}">${capitalizeFirstLetter(agente.habilidades.h1)}</option>`
    selectHabilidad.insertAdjacentHTML('beforeend', opcion1)

    let opcion2 = `<option value="${agente.habilidades.h2}">${capitalizeFirstLetter(agente.habilidades.h2)}</option>`
    selectHabilidad.insertAdjacentHTML('beforeend', opcion2)

    let opcion3 = `<option value="${agente.habilidades.h3}">${capitalizeFirstLetter(agente.habilidades.h3)}</option>`
    selectHabilidad.insertAdjacentHTML('beforeend', opcion3)

    let opcion4 = `<option value="${agente.habilidades.h4}">${capitalizeFirstLetter(agente.habilidades.h4)}</option>`
    selectHabilidad.insertAdjacentHTML('beforeend', opcion4)

    if (agente.habilidades.h5) {
        let opcion5 = `<option value="${agente.habilidades.h5}">${capitalizeFirstLetter(agente.habilidades.h5)}</option>`
        selectHabilidad.insertAdjacentHTML('beforeend', opcion5)
    }
})

function resetPovNPreview() {
    inputPov.value = ''
    povPreview.src = "./images/pov-placeholder.png"
    povPreview.style.border = "10px solid #273E47"
    povPreview.style.borderRadius = "10px"
}
document.getElementById('pegarPov').addEventListener('click', async () => {
    const items = await navigator.clipboard.read();
    console.log(items)
    if (items.length > 0) {
    const item = items[0];
    console.log(item)
    for (const type of item.types) {
        if (type.startsWith('image/')) {
        povFilePegada = await item.getType(type);
        generarPovPreview(povFilePegada)
        return;
        }
    }
    alert('No se encontró imagen en el portapapeles.');
    } else {
    alert('El portapapeles está vacío.');
    }
})
inputPov.addEventListener('change', event => {
    const povFileInput = event.target
    const povFile = povFileInput.files[0]
    povFilePegada = null;
    generarPovPreview(povFile)
})
function generarPovPreview(povFile) {
    const maxSizeMB = 25;

    if (povFile) {
        if(!povFile.type.startsWith('image/')){
            alert('Solo se pueden subir imágenes.');
            resetPovNPreview()
        }
        else{
            if(povFile.size > maxSizeMB * 1024 * 1024){
                alert(`La imagen debe pesar menos de ${maxSizeMB}MB).`);
                resetPovNPreview()
            }else{
            povPreview.style.display = 'inline-block'
            povPreview.style.border = "0px"
            povPreview.src = URL.createObjectURL(povFile)
            }
        }
    }
    else resetPovNPreview()
}
inputMap.addEventListener('change', event => {
    const mapFileInput = event.target
    const mapFile = mapFileInput.files[0]
    generarMapPreview(mapFile)
})
function generarMapPreview(mapFile){
    const maxSizeMB = 25;

    if (mapFile) {
        if(!mapFile.type.startsWith('image/')){
            alert('Solo se pueden subir imágenes.');
            resetMapNPreview()
        }else{
            if(mapFile.size > maxSizeMB * 1024 * 1024){
            alert(`La imagen debe pesar menos de ${maxSizeMB}MB).`);
            resetMapNPreview()
            }else{
                mapPreview.style.display = 'inline-block'
                mapPreview.style.border = "3px solid rgb(216, 151, 60)"
                mapPreview.src = URL.createObjectURL(mapFile)
            }
        }
    }
    else resetMapNPreview()
}


function resetMapNPreview() {
    inputMap.value = ''
    mapPreview.src = "./images/map-placeholder.png"
    mapPreview.style.border = "3px solid #D8973C"
    mapPreview.style.opacity = "1"
}
document.getElementById('agente').addEventListener('change', event => {

    inputHabilidad.disabled = !event.target.value
    if (!event.target.value) inputHabilidad.value = ""
})
function resetHabilidad() {
    inputHabilidad.disabled = true
    inputHabilidad.value = ""
}
function vaciarInput() {
    formCrear.reset()
    resetPovNPreview()
    resetMapNPreview()
    resetHabilidad()
}

function postCardSiImgListas(povReady, mapReady, nuevaCard){
    if(povReady && mapReady){
        fetch('http://localhost:3000/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevaCard)
        })
          .then(response => response.json())
          .then(data => {
            console.log('Card guardada:', data);
        })
        .catch(error => console.error('Error al guardar la card:', error));
    }
}
formCrear.addEventListener('submit', event => {
    let povReady = false
    let mapReady = false
    event.preventDefault()
    const formData = new FormData(event.target)
    const formObject = Object.fromEntries(formData.entries())

    const opcionesfecha = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const fechaHoy = new Date()
    // .toLocaleString('es-ES', opcionesfecha).replace(',', ' •')
    formObject.fecha = fechaHoy.toISOString()

    // if (povFilePegada) {
    // inputPov.removeAttribute('required');
    // } else {
    // inputPov.setAttribute('required', '');
    // }
    const povFileFinal = povFilePegada || formObject.povSrc;
    if (povFileFinal) {
    let reader = new FileReader();
    reader.readAsDataURL(povFileFinal);
    reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
            // Crear un canvas para redibujar la imagen
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Establecer las dimensiones del canvas igual a las de la imagen
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Dibujar la imagen en el canvas
            ctx.drawImage(img, 0, 0);
            
            // Convertir el canvas a WebP (calidad: 0.8, puedes ajustarlo)
            canvas.toBlob((blob) => {
                const webpReader = new FileReader();
                webpReader.readAsDataURL(blob);
                webpReader.onload = () => {
                    formObject.povSrc = webpReader.result; // Ahora es WebP en base64
                    povReady = true;
                    postCardSiImgListas(povReady, mapReady, formObject);
                };
            }, 'image/webp', 0.8); // 0.8 es la calidad (0 a 1)
        };
    };
}
const povMapFinal = mapFilePegada || formObject.mapSrc;
if (povMapFinal) {
    let reader = new FileReader();
    reader.readAsDataURL(povMapFinal);
    reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
            // Crear un canvas para redibujar la imagen
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Establecer las dimensiones del canvas igual a las de la imagen
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Dibujar la imagen en el canvas
            ctx.drawImage(img, 0, 0);
            
            // Convertir el canvas a WebP (calidad: 0.8, puedes ajustarlo)
            canvas.toBlob((blob) => {
                const webpReader = new FileReader();
                webpReader.readAsDataURL(blob);
                webpReader.onload = () => {
                    formObject.mapSrc = webpReader.result; // Ahora es WebP en base64
                    mapReady = true;
                    postCardSiImgListas(povReady, mapReady, formObject);
                };
            }, 'image/webp', 0.8); // 0.8 es la calidad (0 a 1)
        };
    };
}

    // revisar esto pq vacairinput no recibe parametros
    // const keysArray = [...formData.keys()]
    // vaciarInput(keysArray)
    vaciarInput()
    const toastTrigger = document.getElementById('liveToastBtn')
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
    //si no tengo nada, ageragr 1 form
    //si ya tengo uno, cambiar 'form' a 'form1'
    // const storageLength = localStorage.length
    // localStorage.setItem(`form${storageLength +  1}`, JSON.stringify(formObject))
})

