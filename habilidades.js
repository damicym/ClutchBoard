const maxContainer = document.getElementById("maxContainer")
const inputDivision = document.getElementById('order-input-form-hb')
const inputAutor = document.getElementById('autor-input-form-hb')
const inputHabilidad = document.getElementById('habilidad-input-form-hb')
const inputAgente = document.getElementById('agente-input-form-hb')
const inputMapa = document.getElementById('mapa-input-form-hb')
const inputComp = document.getElementById('comp-input-form-hb')
const formHb = document.getElementById('form-hb')
const basura = document.getElementById('basura')

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}
function uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
}
function mostrarToast(status, msg) {
    const toastElement = document.getElementById('toast-hb')
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
            }, 2500)
        }
        toastElement.addEventListener('mouseenter', handleMouseEnter)
        toastElement.addEventListener('mouseleave', handleMouseLeave)
        setTimeout(() => {
            if (!isHovered) {
                toast.hide()
            }
        }, 2500)
    }

    toastElement.addEventListener('hidden.bs.toast', function cleanup() {
        toastElement.removeEventListener('mouseenter', handleMouseEnter)
        toastElement.removeEventListener('mouseleave', handleMouseLeave)
        toastElement.removeEventListener('hidden.bs.toast', cleanup)
    })
}
resetHabilidad()
let allCards = []
let agentes = []
let mapas = []
let compMaps = []
let cardsActuales = []
fetch('data/mapas.json')
    .then(data => data.json())
    .then(data => {
        mapas = data

        // estos 3 localstorag hay q sacar para usar la base de datos
        mapas.forEach(mapa => {
            if (mapa.compPool) compMaps.push(mapa.nombre)
        })
        fetch('data/agentes.json')
            .then(data => data.json())
            .then(data => {
                agentes = data
                fetch('data/cards.json')
                    .then(data => data.json())
                    .then(data => {
                        var JsonCards = data
                        let dbCards = []
                        // conseguir cards del localStorage:
                        // for (let index = 0; index < localStorage.length; index++) {
                        //     let key = localStorage.key(index)
                        //     if (key.startsWith("form")) {
                        //         let formData = JSON.parse(localStorage.getItem(key)) || []
                        //         dbCards.push(formData)
                        //     }
                        // }
                        // conseguir cards de la BD:
                        fetch('http://localhost:3000/cards', {
                            method: 'GET'
                        })
                        .then(res => res.json())
                        .then(cards => {
                            dbCards = cards
                            allCards = [...dbCards, ...JsonCards]
                            cardsActuales = allCards
                            generarOpcionesMapas(allCards, mapas)
                            generarOpcionesAgentes(allCards, agentes)
                            generarCards(cardsActuales, agentes, mapas)
                        })
                        .catch(err => {
                            console.error('Error al obtener las cards:', err);
                        });
                    })
            })

    })

function generarOpcionesAgentes(cards, agentes) {
    agentes.forEach(agente => {
        if (allCards.some(card => card.agente === agente.nombre)) {
            var opcion = `<option value="${agente.nombre}">${capitalizeFirstLetter(agente.nombre)}</option>`
            inputAgente.innerHTML += opcion
        }
    })
}

function generarOpcionesMapas(cards, mapas) {
    mapas.forEach(mapa => {
        if (cards.some(card => card.mapa === mapa.nombre)) {
            var opcion = `<option value="${mapa.nombre}">${capitalizeFirstLetter(mapa.nombre)}</option>`
            inputMapa.innerHTML += opcion
        }
    })
}

//ver si en vez de allCards mostrar por cardsActuales
// ver pq parece ser q son las actuales en realidad
inputAgente.addEventListener('change', event => {
    if (!event.target.value) {
        resetHabilidad()
    } else inputHabilidad.disabled = false
    
    aplicarFiltros()
    revisarBasura()

    const agenteSeleccionado = event.target.value
    const indice = agentes.findIndex(obj => obj.nombre === agenteSeleccionado)
    const agente = agentes[indice]
    inputHabilidad.innerHTML = ""
    inputHabilidad.insertAdjacentHTML('beforeend', '<option value="">Elige una habilidad</option>')
    var cardsAgenteSeleccionado = allCards.filter(card => card.agente === agenteSeleccionado)
    if (cardsAgenteSeleccionado.some(card => card.habilidad === agente.habilidades.h1)) {
        let opcion1 = `<option value="${agente.habilidades.h1}">${capitalizeFirstLetter(agente.habilidades.h1)}</option>`
        inputHabilidad.insertAdjacentHTML('beforeend', opcion1)
    }
    if (cardsAgenteSeleccionado.some(card => card.habilidad === agente.habilidades.h2)) {
        let opcion2 = `<option value="${agente.habilidades.h2}">${capitalizeFirstLetter(agente.habilidades.h2)}</option>`
        inputHabilidad.insertAdjacentHTML('beforeend', opcion2)
    }
    if (cardsAgenteSeleccionado.some(card => card.habilidad === agente.habilidades.h3)) {
        let opcion3 = `<option value="${agente.habilidades.h3}">${capitalizeFirstLetter(agente.habilidades.h3)}</option>`
        inputHabilidad.insertAdjacentHTML('beforeend', opcion3)
    }
    if (cardsAgenteSeleccionado.some(card => card.habilidad === agente.habilidades.h4)) {
        let opcion4 = `<option value="${agente.habilidades.h4}">${capitalizeFirstLetter(agente.habilidades.h4)}</option>`
        inputHabilidad.insertAdjacentHTML('beforeend', opcion4)
    }
    if (agente.habilidades.h5) {
        if (cardsAgenteSeleccionado.some(card => card.habilidad === agente.habilidades.h5)) {
            let opcion5 = `<option value="${agente.habilidades.h5}">${capitalizeFirstLetter(agente.habilidades.h5)}</option>`
            inputHabilidad.insertAdjacentHTML('beforeend', opcion5)
        }
    }
})
// comento pq lo agrego en el principal
// inputAgente.addEventListener('change', event => {
//     inputHabilidad.disabled = !event.target.value
//     if (!event.target.value) inputHabilidad.value = ""
// })
inputComp.addEventListener('change', event => {
    inputMapa.value = ""
    inputMapa.disabled = event.target.checked
})
function resetHabilidad() {
    inputHabilidad.value = ""
    inputHabilidad.disabled = true
}
function resetMapa() {
    inputMapa.value = ""
    inputMapa.disabled = false
}
function vaciarInput(autorBool) {
    basura.style.animation = "shake2 0.5s ease-in-out"
    if (autorBool) inputAutor.value = ""
    inputAgente.value = ""
    inputComp.checked = false
    resetHabilidad()
    resetMapa()
    aplicarFiltros()
    revisarBasura()
}
function revisarBasura() {
    if (inputComp.checked || inputMapa.value || inputAgente.value || inputHabilidad.value){
        basura.style.animation = "none"
        basura.offsetHeight
        setTimeout(function() {
            basura.style.animation = "shake 0.5s ease-in-out"
        }, 10)
        basura.style.color = "#BD632F"
    }
    else basura.style.color = "#D8C99B"
}
inputMapa.addEventListener('change', event => {
    aplicarFiltros()
    revisarBasura()
})
// comento pq lo agrego en el principal
// inputAgente.addEventListener('change', event => {
//     aplicarFiltros()
//     revisarBasura()
// })
inputHabilidad.addEventListener('change', event => {
    aplicarFiltros()
    revisarBasura()
})
inputComp.addEventListener('change', event => {
    aplicarFiltros()
    revisarBasura()
})
inputAutor.addEventListener('input', event => {
    aplicarFiltros()
})


function aplicarFiltros() {
    cardsActuales = allCards
    if (inputComp.checked) cardsActuales = cardsActuales.filter(card => compMaps.includes(card.mapa))
    else if (inputMapa.value) cardsActuales = cardsActuales.filter(card => card.mapa === inputMapa.value)
    if (inputAgente.value) cardsActuales = cardsActuales.filter(card => card.agente === inputAgente.value)
    if (inputHabilidad.value) cardsActuales = cardsActuales.filter(card => card.habilidad === inputHabilidad.value)
    if (inputAutor.value) cardsActuales = cardsActuales.filter(card => card.nombre.toLowerCase().includes(inputAutor.value.toLowerCase()))
    generarCards(cardsActuales, agentes, mapas) //a esto le vas a tener q pasar mapas dsps para lo de dividir
    if (cardsActuales.length === 0) maxContainer.innerHTML += `<div class="no-result">
    <h2 class="mapa-titulo" style="margin-bottom: 10px; color: #BD632F;">No se encontró ningún resultado :(</h2>
    <span class="mi-link" onclick="vaciarInput(true)">Borrar condiciones de filtro</span>
    </div>`
}
// declaro división:
if (localStorage.getItem('division')) inputDivision.value = localStorage.getItem('division')
else inputDivision.value = "agente"
inputDivision.addEventListener('change', event => {
    var division = event.target.value
    localStorage.setItem('division', division)
    generarCards(cardsActuales, agentes, mapas)
})
const opcionesfecha = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
};
function generarCards(cards, agentes, mapas) {
    maxContainer.innerHTML = ""
    let division
    if (localStorage.getItem('division')) division = localStorage.getItem('division')
    else division = "agente"
    // localStorage.getItem('division')
    if (division === "agente") {
        agentes.map(agente => {
            const cardsDe1Agente = cards.filter(card => card.agente === agente.nombre)
            cardsDe1Agente.sort((a, b) => a.mapa.localeCompare(b.mapa))
            if (cardsDe1Agente.length > 0) {
                maxContainer.innerHTML += `<h2 class="mapa-titulo">${capitalizeFirstLetter(agente.nombre)}</h2>
                <div class="card-container" id="${agente.nombre}-container"></div>`
                const agenteContainer = document.getElementById(`${agente.nombre}-container`)
                    cardsDe1Agente.map((card, index) => {
                        let cardHtml = `<article class="card">
                                <p class="title">
                                    <span class="title-num">${index + 1}</span>
                                    <span class="title-text">${card.mapa.toUpperCase()}</span>
                                </p>
                                <img class="map" src="${card.mapSrc}" loading="lazy">
                                <img class="pov" src="${card.povSrc}" loading="lazy">
                                <span class="title-text-user">${card.titleText}</span>
                                <p class="desc">${card.desc}</p>
                               <div class="firma">
                                    <span class="autor">${card.nombre} •</span>
                                    <span class="fecha-card">${new Date(card.fecha).toLocaleString('es-ES', opcionesfecha).replace(',', ' •')}</span>
                               </div>
                            </article>`
                        agenteContainer.innerHTML += cardHtml
                    })
            }
        })
    } else {
        if (division === "mapa") {
            mapas.map(mapa => {
                const cardsDe1Mapa = cards.filter(card => card.mapa === mapa.nombre)
                cardsDe1Mapa.sort((a, b) => a.agente.localeCompare(b.agente))
                if (cardsDe1Mapa.length > 0) {
                    maxContainer.innerHTML += `<h2 class="mapa-titulo">${capitalizeFirstLetter(mapa.nombre)}</h2>
                        <div class="card-container" id="${mapa.nombre}-container"></div>`
                    const mapaContainer = document.getElementById(`${mapa.nombre}-container`)
                    cardsDe1Mapa.map((card, index) => {
                        let cardHtml = `<article class="card">
                                <p class="title">
                                    <span class="title-num">${index + 1}</span>
                                    <span class="title-text">${card.agente.toUpperCase()}</span>
                                </p>
                                <img class="map" src="${card.mapSrc}">
                                <img class="pov" src="${card.povSrc}">
                                <span class="title-text-user">${card.titleText}</span>
                                <p class="desc">${card.desc}</p>
                               <div class="firma">
                                    <span class="autor">${card.nombre} •</span>
                                    <span class="fecha-card">${card.fecha}</span>
                               </div>
                            </article>`
                        mapaContainer.innerHTML += cardHtml
                    })
                }
            })
        }
    }
}

formHb.addEventListener('submit', event => {
    event.preventDefault()
})