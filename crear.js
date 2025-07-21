//mis elementos:
const selectHabilidad = document.getElementById('habilidad')
const povPreview = document.getElementById('pov-preview')
const mapPreview = document.getElementById('map-preview')
// const inputHabilidad = document.getElementById('habilidad')
const agenteSelect = document.getElementById('agente-select')
const formCrear = document.getElementById('form-crear')
const inputPov = document.getElementById('input-pov')
const inputMap = document.getElementById('input-map')
const povMenu = document.getElementById('pov-menu')
const mapMenu = document.getElementById('map-menu')
const pegarPov = document.getElementById('pegar-pov')
const pegarMap = document.getElementById('pegar-map')
const eliminarPovButton = document.getElementById('eliminar-pov-button')
const eliminarMapButton = document.getElementById('eliminar-map-button')
const astBeforeTitle = document.getElementById('ast-before-title')
const spinner = document.getElementById('spinner-in-toast')
const spinnerInSubmit = document.getElementById('spinner-in-submit')
const submitBtn = document.getElementById('submitBtn')
const inputTitle = document.getElementById('title')
const inputDesc = document.getElementById('input-desc')
const inputNombre = document.getElementById('nombre')
const selectMapa = document.getElementById('select-mapa')
const subirArchivoBtn = document.getElementById('subir-archivo-btn')

let povFilePegada = null
let mapFilePegada = null
let prevPovObjectURL = null
let prevMapObjectURL = null
let datosImportantesSinImgPegada = false
// let vacio = true

function actualizarEstadoDeDatos(){
    const formData = new FormData(formCrear)

    vacio = [...formData.values()].every(valor => {
    if (typeof valor === 'string') {
        return !valor.trim()
    } else if (valor instanceof File) {
        return valor.size === 0;
    } else {
        return false
    }
    })
    const hayImagenPegada = !!povFilePegada || !!mapFilePegada
    const hayImagenSubida = inputPov.value !== '' || inputMap.value !== ''
    datosImportantesSinImgPegada = !vacio || hayImagenPegada || hayImagenSubida
}

formCrear.addEventListener('change', actualizarEstadoDeDatos)

window.addEventListener('beforeunload', (e) => {
    actualizarEstadoDeDatos()
    if (datosImportantesSinImgPegada) {
        e.preventDefault()
        e.returnValue = ''
    }
})

function mostrarToast(status, msg) {
    const toastElement = document.getElementById('liveToast')
    let toast = bootstrap.Toast.getOrCreateInstance(toastElement, {
        autohide: false
    })
    toastElement.classList.remove('ok', 'error', 'loading')
    toastElement.classList.add(status)
    if (status === 'loading') spinner.style.display = 'block'
    else spinner.style.display = 'none'
    toastElement.querySelector('.toast-body').innerHTML = msg
    toast.show()

    if(status !== 'loading'){
        let isHovered = false
        let leaveTimeoutId = null
        function handleMouseEnter() {
            isHovered = true
            if (leaveTimeoutId) {
                clearTimeout(leaveTimeoutId)
                leaveTimeoutId = null
            }
        }
        function handleMouseLeave() {
            isHovered = false
            leaveTimeoutId = setTimeout(() => {
                toast.hide()
            }, 3000)
        }
        toastElement.addEventListener('mouseenter', handleMouseEnter)
        toastElement.addEventListener('mouseleave', handleMouseLeave)
        setTimeout(() => {
            if (!isHovered) {
                toast.hide()
            }
        }, 3000)
    }

    toastElement.addEventListener('hidden.bs.toast', function cleanup() {
        toastElement.removeEventListener('mouseenter', handleMouseEnter)
        toastElement.removeEventListener('mouseleave', handleMouseLeave)
        toastElement.removeEventListener('hidden.bs.toast', cleanup)
    })
}

// ----------input de imgs y previews-------------
// que se haga con entre y espacio (hay q ponerle tabindex 0 a los html)
// povPreview.addEventListener('keydown', e => {
//   if (e.key === 'Enter' || e.key === ' ') {
//     e.preventDefault() // Previene scroll si se presiona espacio
//     povPreview.click()
//   }
// })
// mapPreview.addEventListener('keydown', e => {
//   if (e.key === 'Enter' || e.key === ' ') {
//     e.preventDefault() // Previene scroll si se presiona espacio
//     mapPreview.click()
//   }
// })
document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
        povMenu.classList.remove('abierto')
        povPreview.classList.remove('preview-activo')
        mapMenu.classList.remove('abierto')
        mapPreview.classList.remove('preview-activo')
    }
})
document.addEventListener('click', e => {
    cerrarUploadMenusSiTocaAfuera(e)
})
document.addEventListener('contextmenu', e => {
    cerrarUploadMenusSiTocaAfuera(e)
})
eliminarPovButton.addEventListener('click', () => {
    resetPovNPreview()
    povFilePegada = null
    povPreview.classList.remove('preview-activo')
    povMenu.classList.remove('abierto')
    inputPov.setAttribute('required', '')
})
function cerrarUploadMenusSiTocaAfuera(e) {
    if (!povMenu.contains(e.target) && e.target !== povPreview) {
        povMenu.classList.remove('abierto')
        povPreview.classList.remove('preview-activo')
  }
    if (!mapMenu.contains(e.target) && e.target !== mapPreview) {
        mapMenu.classList.remove('abierto')
        mapPreview.classList.remove('preview-activo')
  }
}
function clickInputPov() {
    inputPov.click()
}
povPreview.addEventListener('click', e => {
    povPreview.classList.add('preview-activo')
    mapPreview.classList.remove('preview-activo')
    if(povFilePegada || inputPov.value != "") eliminarPovButton.removeAttribute('disabled')
        else eliminarPovButton.setAttribute('disabled', '')
    mostrarMenu(povMenu, mapMenu, e)
})
eliminarMapButton.addEventListener('click', () => {
    resetMapNPreview()
    mapFilePegada = null
    mapPreview.classList.remove('preview-activo')
    mapMenu.classList.remove('abierto')
})
povPreview.addEventListener('contextmenu', e => {
    e.preventDefault()
    povPreview.classList.add('preview-activo')
    mapPreview.classList.remove('preview-activo')
    if(povFilePegada || inputPov.value != "") eliminarPovButton.removeAttribute('disabled')
        else eliminarPovButton.setAttribute('disabled', '')
    mostrarMenu(povMenu, mapMenu, e)
})
function clickInputMap() {
    inputMap.click()
}
mapPreview.addEventListener('click', e => {
    mapPreview.classList.add('preview-activo')
    povPreview.classList.remove('preview-activo')
    if(mapFilePegada || inputMap.value != "") eliminarMapButton.removeAttribute('disabled')
        else eliminarMapButton.setAttribute('disabled', '')
    mostrarMenu(mapMenu, povMenu, e)
})
mapPreview.addEventListener('contextmenu', e => {
    e.preventDefault()
    mapPreview.classList.add('preview-activo')
    povPreview.classList.remove('preview-activo')
    if(mapFilePegada || inputMap.value != "") eliminarMapButton.removeAttribute('disabled')
        else eliminarMapButton.setAttribute('disabled', '')
    mostrarMenu(mapMenu, povMenu, e)
})

// si no tenes permiso a portapapeles, 
// 1. mostrar el boton con el icono y texto de pedir permiso
// 2. una vez tocas el boton (de pedir acceso) evaluar portapapeles
// 3. mostrar el boton según si hay items
// si sí tenes permiso, 
// 1. evaluar portapapeles
// 2. mostrar el boton según si hay items
// si el boton es de permitir acceso, cuando lo tocas
// 1. evaluarPortapapelesYBtn()


function devolverPegarBtn(menu){
    return menu.querySelectorAll('[id^="pegar-"]')[0]
}
async function devolverPermisoDePortapapeles(){
    return await navigator.permissions.query({ name: 'clipboard-read' })
}
async function mostrarMenu(menuPrincipal, menuSecundario, e) {
    const pegarButtonTarget = devolverPegarBtn(menuPrincipal)
    const permiso = await devolverPermisoDePortapapeles()
    if(permiso.state === 'granted'){
        evaluarPortapapelesYBtn(pegarButtonTarget)
    } else if(permiso.state === 'prompt'){
        estilarPegarBtnByPermiso(pegarButtonTarget, true)
    } else{
        estilarPegarBtnByPermiso(pegarButtonTarget, false)
    }
    menuPrincipal.style.left = `${e.clientX}px`
    menuPrincipal.style.top = `${e.clientY}px`
    menuPrincipal.classList.add('abierto')
    menuSecundario.classList.remove('abierto')
}
async function evaluarPortapapelesYBtn(btn){
    if (!navigator.clipboard?.read) {
        mostrarToast('error', 'Tu navegador no permite acceder al portapapeles')
        return
    }
    try{
        const items = await navigator.clipboard.read()
        if (items.length > 0) {
        const item = items[0]
        for (const type of item.types) {
            if (type.startsWith('image/')) {
                estilarPegarBtnByItems(btn, true)
            return
            }
        }
            estilarPegarBtnByItems(btn, false)
        } else {
            estilarPegarBtnByItems(btn, false)
        }
    }catch(err){
        if (!err.name === 'NotAllowedError'){
            mostrarToast('error', `No se pudo acceder al portapapeles: ${err.message}`)
        }
    }
    
}
function estilarPegarBtnByPermiso(button, enabled){
    if(enabled){
        // button.classList.remove('grantedState')
        button.removeAttribute('disabled')
        button.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>
        Permitir acceso a portapapeles`
    }else{
        // button.classList.remove('grantedState')
        button.setAttribute('disabled', '')
        button.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>
        Acceso a portapapeles denegado`
    }
} 
function estilarPegarBtnByItems(button, enabled){
    if(enabled){
        // button.classList.add('grantedState')
        button.removeAttribute('disabled')
        button.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>
        Pegar de portapapeles`
    }else{
        // button.classList.remove('grantedState')
        button.setAttribute('disabled', '')
        button.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5.575 5.597a2 2 0 0 0 -.575 1.403v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2m0 -4v-8a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 1 1 0 4h-2" /><path d="M3 3l18 18" /></svg>
        Pegar de portapapeles`
    }
}
pegarPov.addEventListener('click', async () => {
    if (!navigator.clipboard?.read) {
        mostrarToast('error', 'Tu navegador no permite acceder al portapapeles')
        return
    }
    const pegarButtonTarget = devolverPegarBtn(povMenu)
    const hayPermiso = (await devolverPermisoDePortapapeles()).state === 'granted'
    try{
        const items = await navigator.clipboard.read()
        // pegarButtonTarget.classList.contains('grantedState')
        if(hayPermiso){
            if (items.length > 0) {
            const item = items[0]
            for (const type of item.types) {
                if (type.startsWith('image/')) {
                povFilePegada = await item.getType(type)
                povPreview.classList.remove('preview-activo')
                povMenu.classList.remove('abierto')
                inputPov.value = ''
                inputPov.removeAttribute('required')
                generarPovPreview(povFilePegada)
                return
                }
            }
            mostrarToast('error', 'Error: No se encontró imagen en el portapapeles')
            } else {
                mostrarToast('error', 'Error: El portapapeles está vacío')
            }
        } else evaluarPortapapelesYBtn(pegarButtonTarget)
    } catch(err){
        if (!err.name === 'NotAllowedError'){
            mostrarToast('error', `No se pudo acceder al portapapeles: ${err.message}`)
        }
    }
    // povMenu.style.display = 'none'
    povPreview.classList.remove('preview-activo')
    povMenu.classList.remove('abierto')
})
pegarMap.addEventListener('click', async () => {
    if (!navigator.clipboard?.read) {
        mostrarToast('error', 'Tu navegador no permite el uso de portapapeles')
        return
    }
    const pegarButtonTarget = devolverPegarBtn(mapMenu)
    const hayPermiso = (await devolverPermisoDePortapapeles()).state === 'granted'
    try{
        const items = await navigator.clipboard.read()
        // pegarButtonTarget.classList.contains('grantedState')
        if(hayPermiso){
            if (items.length > 0) {
            const item = items[0]
            for (const type of item.types) {
                if (type.startsWith('image/')) {
                mapFilePegada = await item.getType(type)
                mapPreview.classList.remove('preview-activo')
                mapMenu.classList.remove('abierto')
                inputMap.value = ''
                generarMapPreview(mapFilePegada)
                return
                }
            }
            mostrarToast('error', 'Error: No se encontró imagen en el portapapeles')
            } else {
            mostrarToast('error', 'Error: El portapapeles está vacío')
            }
        } else evaluarPortapapelesYBtn(pegarButtonTarget)
    } catch(err){
        if (!err.name === 'NotAllowedError'){
            mostrarToast('error', `No se pudo acceder al portapapeles: ${err.message}`)
        }
    }
    // mapMenu.style.display = 'none'
    mapPreview.classList.remove('preview-activo')
    mapMenu.classList.remove('abierto')
})
function resetPovNPreview() {
    if (prevPovObjectURL) {
        URL.revokeObjectURL(prevPovObjectURL)
        prevPovObjectURL = null
    }
    inputPov.value = ''
    povPreview.src = "./images/pov-select.png"
    povPreview.style.border = "10px solid #273E47"
    povPreview.style.borderRadius = "10px"
}
inputPov.addEventListener('change', event => {
    const povFileInput = event.target
    const povFile = povFileInput.files[0]
    povFilePegada = null
    inputPov.setAttribute('required', '')
    generarPovPreview(povFile)
})
function generarPovPreview(povFile) {
    const maxSizeMB = 15

    if (povFile) {
        if(!povFile.type.startsWith('image/')){
            mostrarToast('error', 'Error: Solo se pueden subir imágenes')
            resetPovNPreview()
        }
        else{
            if(povFile.size > maxSizeMB * 1024 * 1024){
                mostrarToast('error', `Error: La imagen debe pesar menos de ${maxSizeMB}MB`)
                resetPovNPreview()
            }else{
                if (prevPovObjectURL) {
                    URL.revokeObjectURL(prevPovObjectURL)
                }
                prevPovObjectURL = URL.createObjectURL(povFile)
                povPreview.style.display = 'inline-block'
                povPreview.style.border = '0px'
                povPreview.src = prevPovObjectURL
                // povPreview.src = URL.createObjectURL(povFile)
            }
        }
    }
    else { resetPovNPreview() }
    astBeforeTitle.focus()
}
inputMap.addEventListener('change', event => {
    const mapFileInput = event.target
    const mapFile = mapFileInput.files[0]
    mapFilePegada = null
    generarMapPreview(mapFile)
})
function generarMapPreview(mapFile){
    const maxSizeMB = 15

    if (mapFile) {
        if(!mapFile.type.startsWith('image/')){
            mostrarToast('error', 'Error: Solo se pueden subir imágenes')
            resetMapNPreview()
        }else{
            if(mapFile.size > maxSizeMB * 1024 * 1024){
            mostrarToast('error', `Error: La imagen debe pesar menos de ${maxSizeMB}MB`)
            resetMapNPreview()
            }else{
                if (prevMapObjectURL) {
                    URL.revokeObjectURL(prevMapObjectURL)
                }
                prevMapObjectURL = URL.createObjectURL(mapFile)
                mapPreview.style.display = 'inline-block'
                mapPreview.style.border = "3px solid rgb(216, 151, 60)"
                mapPreview.src = prevMapObjectURL
                // mapPreview.src = URL.createObjectURL(mapFile)
            }
        }
    }
    else resetMapNPreview()
    astBeforeTitle.focus()
}

function resetMapNPreview() {
    if (prevMapObjectURL) {
        URL.revokeObjectURL(prevMapObjectURL)
        prevMapObjectURL = null
    }

    inputMap.value = ''
    mapPreview.src = "./images/map-select.png"
    mapPreview.style.border = "3px solid #D8973C"
    mapPreview.style.opacity = "1"
}
//-----------fin de input de imgs y previews-------------

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}
var agentes = {}
var mapas = {}

const opcionesfecha = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}
const mostrarFecha = () => {
    const fechaHoy = new Date().toLocaleString('es-ES', opcionesfecha).replace(',', ' •')
    document.getElementById('fecha-hoy').innerHTML = fechaHoy
}
const fechaIntervaloSeg = setInterval(mostrarFecha, 59000)
mostrarFecha()

fetch('data/agentes.json')
.then(data => data.json())
.then(data => {
    agentes = data

    agentes.map(agente => {
        let opcion = `<option value="${agente.nombre}">${capitalizeFirstLetter(agente.nombre)}</option>`
        agenteSelect.innerHTML += opcion
    })
})
fetch('data/mapas.json')
.then(data => data.json())
.then(data => {
    mapas = data

    mapas.map(mapa => {
        let opcion = `<option value="${mapa.nombre}">${capitalizeFirstLetter(mapa.nombre)}</option>`
        selectMapa.innerHTML += opcion
    })
})


function uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
}

agenteSelect.addEventListener('change', event => {
    const agenteSeleccionado = event.target.value
    const indice = agentes.findIndex(obj => obj.nombre === agenteSeleccionado)
    const agente = agentes[indice]

    selectHabilidad.innerHTML = ""
    selectHabilidad.insertAdjacentHTML('beforeend', '<option value="">Elige una habilidad</option>')
    if(agente){
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
    }
})


agenteSelect.addEventListener('change', event => {

    selectHabilidad.disabled = !event.target.value
    if (!event.target.value) selectHabilidad.value = ""
})
function resetHabilidad() {
    selectHabilidad.disabled = true
    selectHabilidad.value = ""
}
function vaciarInput() {
    formCrear.reset()
    resetPovNPreview()
    resetMapNPreview()
    resetHabilidad()
}

// povReady, mapReady, 
// if(povReady && mapReady){}

async function postCard(nuevaCard){
    try{
        const response = await fetch('http://localhost:3000/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaCard)
        })
        const data = await response.json()
        if(data.error) {
            console.error(data.error)
            return [false, data.error]
        } else {
            console.log('Card guardada:', data)
            return [true, `¡Artículo publicado exitosamente en <a class="mi-link" href="habilidades.html">Habilidades</a>!`]
        }
    } catch(err){
        console.error('Error al guardar la card:', err)
        [false, err?.message || 'No se pudo guardar el artículo']
    }
}

function convertirAWebP(file) {
    return new Promise((resolve, reject) => {
        if (file.size > 0){
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const img = new Image()
                img.src = reader.result

                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = img.width
                    canvas.height = img.height
                    ctx.drawImage(img, 0, 0)

                    canvas.toBlob((blob) => {
                        const webpReader = new FileReader()
                        webpReader.readAsDataURL(blob)
                        webpReader.onload = () => {
                            resolve(webpReader.result)
                        }
                        webpReader.onerror = () => reject(new Error('Error al leer la imagen convertida a WebP.'))
                    }, 'image/webp', 0.7)
                }

                img.onerror = () => reject(new Error('Error al cargar la imagen.'))
            }

            reader.onerror = () => reject(new Error('Error al leer el archivo original.'))
        } else { resolve('') }
       
    })
}

async function usarFormObject(formObject){
    // let povReady = false
    // let mapReady = false
    const fechaHoy = new Date()
    formObject.fecha = fechaHoy.toISOString()

    const povFileFinal = povFilePegada || formObject.povSrc
    try {
        formObject.povSrc = await convertirAWebP(povFileFinal)
    } catch (err){
        return [false, 'Error al cargar la imagen POV']
    }

    const mapFileFinal = mapFilePegada || formObject.mapSrc
    try {
        formObject.mapSrc = await convertirAWebP(mapFileFinal)
    } catch (err){
        return [false, 'Error al cargar la imagen MAP']
    }

    return postCard(formObject)
}

function desHabilitarInputs(enabled){
    const formInputs = [povPreview, mapPreview, submitBtn, agenteSelect, selectHabilidad, selectMapa, inputNombre, inputDesc, inputTitle]
    
    if(enabled){
        formInputs.forEach(element => {
            // element.removeAttribute('disabled')
            // element.style.opacity = '1'
            submitBtn.removeAttribute('disabled')
            submitBtn.style.boxShadow = '0px 0px 10px var(--color2)'
            element.style.pointerEvents = 'auto'
        })
    } else{
        formInputs.forEach(element => {
            // element.setAttribute('disabled', '')
            // selectHabilidad.setAttribute('disabled', '')
            submitBtn.setAttribute('disabled', '')
            submitBtn.style.boxShadow = 'none'
            // element.style.opacity = '0,5'
            element.style.pointerEvents = 'none'
        })
    }
}
function vaciarVariablesGlobales(){
    povFilePegada = null
    mapFilePegada = null
    prevPovObjectURL = null
    prevMapObjectURL = null
    datosImportantesSinImgPegada = false
}
formCrear.addEventListener('submit', async(event) => {
    event.preventDefault()
    desHabilitarInputs(false)
    // <span class="visually-hidden">Loading...</span>
    submitBtn.innerHTML = `<div class="spinner-border" role="status" id="spinner-in-submit">
                            </div>
                            Cargando...`
   
    // mostrarToast('loading', 'Cargando...')
    const formData = new FormData(event.target)
    const formObject = Object.fromEntries(formData.entries())

    let resultado = [false, 'Se produjo un error al intentar publicar el artículo']
    resultado = await usarFormObject(formObject)
    vaciarInput()

    // return [true, `¡Artículo publicado exitosamente en <a class="mi-link" href="habilidades.html">Habilidades</a>!`]
    mostrarToast(resultado[0] ? 'ok' : 'error', resultado[1])
    desHabilitarInputs(true)
    vaciarVariablesGlobales()
    resetPovNPreview()
    resetMapNPreview()
    submitBtn.innerHTML = 'Publicar'
})
