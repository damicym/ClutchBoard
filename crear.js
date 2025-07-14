//mis elementos:
const selectHabilidad = document.getElementById('habilidad')
const povPreview = document.getElementById('pov-preview')
const mapPreview = document.getElementById('map-preview')
const inputHabilidad = document.getElementById('habilidad') //asas
const agenteSelect = document.getElementById('agente-select')
const formCrear = document.getElementById('form-crear')
const inputPov = document.getElementById('input-pov')
const inputMap = document.getElementById('input-map')
const povMenu = document.getElementById('pov-menu');
const mapMenu = document.getElementById('map-menu');
const pegarPov = document.getElementById('pegar-pov')
const pegarMap = document.getElementById('pegar-map')
const eliminarPovButton = document.getElementById('eliminar-pov-button')
const eliminarMapButton = document.getElementById('eliminar-map-button')
const astBeforeTitle = document.getElementById('ast-before-title')

let povFilePegada = null;
let mapFilePegada = null;
let prevPovObjectURL = null;
let prevMapObjectURL = null;

// ----------input de imgs y previews-------------
// que se haga con entre y espacio (hay q ponerle tabindex 0 a los html)
// povPreview.addEventListener('keydown', e => {
//   if (e.key === 'Enter' || e.key === ' ') {
//     e.preventDefault(); // Previene scroll si se presiona espacio
//     povPreview.click();
//   }
// });
// mapPreview.addEventListener('keydown', e => {
//   if (e.key === 'Enter' || e.key === ' ') {
//     e.preventDefault(); // Previene scroll si se presiona espacio
//     mapPreview.click()
//   }
// });
document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
        povMenu.classList.remove('abierto');
        povPreview.classList.remove('preview-activo');
        mapMenu.classList.remove('abierto');
        mapPreview.classList.remove('preview-activo');
    }
});
document.addEventListener('click', e => {
  cerrarUploadMenusSiTocaAfuera(e);
});
document.addEventListener('contextmenu', e => {
  cerrarUploadMenusSiTocaAfuera(e);
});
eliminarPovButton.addEventListener('click', () => {
    resetPovNPreview()
    povFilePegada = null
    povPreview.classList.remove('preview-activo');
    povMenu.classList.remove('abierto')
    inputPov.setAttribute('required', '');
})
function cerrarUploadMenusSiTocaAfuera(e) {
  if (!povMenu.contains(e.target) && e.target !== povPreview) {
    povMenu.classList.remove('abierto');
    povPreview.classList.remove('preview-activo');
  }
  if (!mapMenu.contains(e.target) && e.target !== mapPreview) {
    mapMenu.classList.remove('abierto');
    mapPreview.classList.remove('preview-activo');
  }
}
function clickInputPov() {
  inputPov.click();
}
povPreview.addEventListener('click', e => {
  povPreview.classList.add('preview-activo');
  mapPreview.classList.remove('preview-activo');
  mostrarMenu(povMenu, mapMenu, e);
});
eliminarMapButton.addEventListener('click', () => {
    resetMapNPreview()
    mapFilePegada = null
    mapPreview.classList.remove('preview-activo');
    mapMenu.classList.remove('abierto')
})
povPreview.addEventListener('contextmenu', e => {
  e.preventDefault();
  povPreview.classList.add('preview-activo');
  mapPreview.classList.remove('preview-activo');
  mostrarMenu(povMenu, mapMenu, e);
});
function clickInputMap() {
  inputMap.click();
}
mapPreview.addEventListener('click', e => {
  mapPreview.classList.add('preview-activo');
  povPreview.classList.remove('preview-activo');
  mostrarMenu(mapMenu, povMenu, e);
});
mapPreview.addEventListener('contextmenu', e => {
  e.preventDefault();
  mapPreview.classList.add('preview-activo');
  povPreview.classList.remove('preview-activo');
  mostrarMenu(mapMenu, povMenu, e);
});
async function mostrarMenu(menuPrincipal, menuSecundario, e) {
    menuPrincipal.style.left = `${e.clientX}px`;
    menuPrincipal.style.top = `${e.clientY}px`;
    menuPrincipal.classList.add('abierto');
    menuSecundario.classList.remove('abierto');
    const pegarButtonTarget = menuPrincipal.querySelectorAll('[id^="pegar-"]')[0];
    const items = await navigator.clipboard.read();
    if (items.length > 0) {
    const item = items[0];
    for (const type of item.types) {
        if (type.startsWith('image/')) {
            habilitarButton(pegarButtonTarget)
        return;
        }
    }
        deshabilitarButton(pegarButtonTarget)
    } else {
        deshabilitarButton(pegarButtonTarget)
    }
}
function deshabilitarButton(button){
    button.setAttribute('disabled', '')
    button.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5.575 5.597a2 2 0 0 0 -.575 1.403v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2m0 -4v-8a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 1 1 0 4h-2" /><path d="M3 3l18 18" /></svg>
        Pegar de portapapeles`
}
function habilitarButton(button){
    button.removeAttribute('disabled')
    button.innerHTML = ` <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>
        Pegar de portapapeles`
}


function resetPovNPreview() {
    if (prevPovObjectURL) {
        URL.revokeObjectURL(prevPovObjectURL);
        prevPovObjectURL = null;
    }
    inputPov.value = ''
    povPreview.src = "./images/pov-select.png"
    povPreview.style.border = "10px solid #273E47"
    povPreview.style.borderRadius = "10px"
}
pegarPov.addEventListener('click', async () => {
    const items = await navigator.clipboard.read();
    if (items.length > 0) {
    const item = items[0];
    for (const type of item.types) {
        if (type.startsWith('image/')) {
        povFilePegada = await item.getType(type);
        povPreview.classList.remove('preview-activo');
        povMenu.classList.remove('abierto')
        inputPov.value = ''
        inputPov.removeAttribute('required');
        generarPovPreview(povFilePegada)
        return;
        }
    }
    alert('No se encontró imagen en el portapapeles.');
    } else {
    alert('El portapapeles está vacío.');
    }
    povMenu.style.display = 'none';
    povPreview.classList.remove('preview-activo');
    povMenu.classList.remove('abierto')
})
pegarMap.addEventListener('click', async () => {
    const items = await navigator.clipboard.read();
    if (items.length > 0) {
    const item = items[0];
    for (const type of item.types) {
        if (type.startsWith('image/')) {
        mapFilePegada = await item.getType(type);
        mapPreview.classList.remove('preview-activo');
        mapMenu.classList.remove('abierto')
        inputMap.value = ''
        generarMapPreview(mapFilePegada)
        return;
        }
    }
    alert('No se encontró imagen en el portapapeles.');
    } else {
    alert('El portapapeles está vacío.');
    }
    mapMenu.style.display = 'none';
    mapPreview.classList.remove('preview-activo');
    mapMenu.classList.remove('abierto')
})
inputPov.addEventListener('change', event => {
    const povFileInput = event.target
    const povFile = povFileInput.files[0]
    povFilePegada = null;
    inputPov.setAttribute('required', '');
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
                if (prevPovObjectURL) {
                    URL.revokeObjectURL(prevPovObjectURL);
                }
                prevPovObjectURL = URL.createObjectURL(povFile);
                povPreview.style.display = 'inline-block';
                povPreview.style.border = '0px';
                povPreview.src = prevPovObjectURL;
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
                if (prevMapObjectURL) {
                    URL.revokeObjectURL(prevMapObjectURL);
                }
                prevMapObjectURL = URL.createObjectURL(mapFile);
                mapPreview.style.display = 'inline-block'
                mapPreview.style.border = "3px solid rgb(216, 151, 60)"
                mapPreview.src = prevMapObjectURL;
                // mapPreview.src = URL.createObjectURL(mapFile);
            }
        }
    }
    else resetMapNPreview()
    astBeforeTitle.focus()
}

function resetMapNPreview() {
    if (prevMapObjectURL) {
        URL.revokeObjectURL(prevMapObjectURL);
        prevMapObjectURL = null;
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


function uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
}

agenteSelect.addEventListener('change', event => {
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


agenteSelect.addEventListener('change', event => {

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

// async function usarFormObject(formObject) {
//     const fechaHoy = new Date();
//     formObject.fecha = fechaHoy.toISOString();
//     const povFileFinal = povFilePegada || formObject.povSrc;
//     const mapFileFinal = mapFilePegada || formObject.mapSrc;

//     if (povFileFinal instanceof Blob && povFileFinal.size > 0) {
//         try {
//             formObject.povSrc = await convertirAWebP(povFileFinal);
//         } catch (error) {
//             console.error("Error al convertir POV:", error);
//             formObject.povSrc = '';
//         }
//     } else if (typeof povFileFinal === 'string' && povFileFinal.trim() !== '') {
//         formObject.povSrc = povFileFinal;
//     } else {
//         formObject.povSrc = '';
//     }

//     if (mapFileFinal instanceof Blob && mapFileFinal.size > 0) {
//         try {
//             formObject.mapSrc = await convertirAWebP(mapFileFinal);
//         } catch (error) {
//             console.error("Error al convertir MAP:", error);
//             formObject.mapSrc = '';
//         }
//     } else if (typeof mapFileFinal === 'string' && mapFileFinal.trim() !== '') {
//         formObject.mapSrc = mapFileFinal;
//     } else {
//         formObject.mapSrc = '';
//     }

//     // Enviar card
//     console.log(formObject)
//     postCardSiImgListas(formObject);
// }


// function convertirAWebP(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);

//         reader.onload = () => {
//             const img = new Image();
//             img.src = reader.result;

//             img.onload = () => {
//                 const canvas = document.createElement('canvas');
//                 const ctx = canvas.getContext('2d');
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 ctx.drawImage(img, 0, 0);

//                 canvas.toBlob((blob) => {
//                     const webpReader = new FileReader();
//                     webpReader.readAsDataURL(blob);
//                     webpReader.onload = () => {
//                         resolve(webpReader.result);
//                     };
//                     webpReader.onerror = reject;
//                 }, 'image/webp', 0.8);
//             };

//             img.onerror = reject;
//         };

//         reader.onerror = reject;
//     });
// }

async function usarFormObject(formObject){
    let povReady = false
    let mapReady = false
    const fechaHoy = new Date()
    formObject.fecha = fechaHoy.toISOString()

    const povFileFinal = povFilePegada || formObject.povSrc;
    if (povFileFinal.size > 0) {
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
                        // URL.revokeObjectURL(img.src)
                        // img.src = ''
                        postCardSiImgListas(povReady, mapReady, formObject);
                    };
                    // webpReader.onloadend = () => {
                    //     webpReader = null;
                    // };
                }, 'image/webp', 0.8); // 0.8 es la calidad (0 a 1)
            };
            img.onerror = () => {
            console.error("No se pudo cargar la imagen para convertir a WebP");
            };
        };
    } else { 
        povReady = true; 
        formObject.povSrc = ''
    }

    const mapFileFinal = mapFilePegada || formObject.mapSrc;
    if (mapFileFinal.size > 0) {
        let reader = new FileReader();
        reader.readAsDataURL(mapFileFinal);
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
                        // URL.revokeObjectURL(img.src)
                        // img.src = ''
                        postCardSiImgListas(povReady, mapReady, formObject);
                    };
                    // webpReader.onloadend = () => {
                    //     webpReader = null;
                    // };
                }, 'image/webp', 0.8); // 0.8 es la calidad (0 a 1)
            };
            img.onerror = () => {
            console.error("No se pudo cargar la imagen para convertir a WebP");
            };
        };
    } else { 
        mapReady = true; 
        formObject.mapSrc = ''
    }
}

formCrear.addEventListener('submit', async(event) => {
    // mostrarToasts()
    // const toastLiveExample = document.getElementById('liveToast')
    // toastLiveExample.classList.add('loading')
    // const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    // toastBootstrap.show()
    
    event.preventDefault()
    const formData = new FormData(event.target)
    const formObject = Object.fromEntries(formData.entries())
    await usarFormObject(formObject)
    
    vaciarInput()
    // toastLiveExample.classList.add('ready')
    // toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    // toastBootstrap.show()
})

// function mostrarToasts(){
    
// }

