const maxContainer = document.getElementById("maxContainer")
const inputDivision = document.getElementById('order-input-form-hb')
const inputAutor = document.getElementById('autor-input-form-hb')
const inputHabilidad = document.getElementById('habilidad-input-form-hb')
const inputAgente = document.getElementById('agente-input-form-hb')
const inputMapa = document.getElementById('mapa-input-form-hb')
const inputComp = document.getElementById('comp-input-form-hb')
const formHb = document.getElementById('form-hb')
const basura = document.getElementById('basura')
const vaciarAutor = document.getElementById('vaciar-autor')
const maxFilterContainer = document.getElementById('max-filter-container')
const ordenarBtn = document.getElementById('ordenar-btn')

const API_URL = 'https://clutchboard-backend.onrender.com'

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}
function uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
}


let allCards = []
let agentes = []
let mapas = []
let compMaps = []
let cardsActuales = []
let dbCards = []
let localCards = []
let cargando = true
const opcionesfecha = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}
// const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         if(entry.isIntersecting){
//             entry.target.classList.add('show')
//         } else{
//             entry.target.classList.remove('show')
//         }
//     })
// })
// const hiddenElements = document.querySelectorAll('.hidden')
// hiddenElements.forEach((el) => observer.observe(el))
main()

async function main() {
    ordenarBtn.innerHTML = `
    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-transfer-vertical"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 4v16l-6 -5.5" /><path d="M14 20v-16l6 5.5" /></svg>
    ${capitalizeFirstLetter(devolverDivision())}`
    resetHabilidad()
    await cargarDatosLocales()
    mensajeBajoFiltros('loading', 'No estás viendo todos los artículos: los artículos del servidor podrían tardar hasta 50s en cargar')
    generarOpcionesMapas(allCards, mapas)
    generarOpcionesAgentes(allCards, agentes)
    generarCards(cardsActuales, agentes, mapas)
    await cargarDatosApiYAplicarFiltros()
}
function devolverDivision(){
    if(!localStorage.getItem('division')) localStorage.setItem('division', "mapa")
    return localStorage.getItem('division')
}
// inputDivision.addEventListener('change', event => {
//     var division = event.target.value
//     localStorage.setItem('division', division)
//     generarCards(cardsActuales, agentes, mapas)
// })
ordenarBtn.addEventListener('click', () => {
    var division = devolverDivision()
    if(division === "agente") division = "mapa"
        else division = "agente"
        ordenarBtn.innerHTML = `
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-transfer-vertical"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 4v16l-6 -5.5" /><path d="M14 20v-16l6 5.5" /></svg>
    ${capitalizeFirstLetter(division)}`
    localStorage.setItem('division', division)
    generarCards(cardsActuales, agentes, mapas)
})
// mapasLocales, agentesLocales, cardsLocales, cardsBd (si quiero hacer por separado)
async function cargarDatosLocales() {
    try{
        const responseMapas = await fetch('data/mapas.json')
        mapas = await responseMapas.json()
        mapas.forEach(mapa => {
            if (mapa.compPool) compMaps.push(mapa.nombre)
        })
    } catch (err){
        console.log('Error al cargar los mapas: ' + err)
    }
    
    try{
        const responseAgentes = await fetch('data/agentes.json')
        agentes = await responseAgentes.json()
    } catch (err){
        console.log('Error al cargar los agentes: ' + err)
    }

    try{
        const responseLocalCards = await fetch('data/cards.json')
        localCards = await responseLocalCards.json()
    } catch (err){
        console.log('Error al cargar artículos locales: ' + err)
    }
    allCards = localCards
    cardsActuales = allCards
    // try{
    //     const responseDbCards = await fetch(`${API_URL}/cards`, { method: 'GET', headers: {
    //         'Content-Type': 'application/json'
    //     }})
    //     if(!responseDbCards.ok) throw new Error('response not ok')
    //     dbCards = await responseDbCards.json()
    // } catch (err){
    //     console.log('Error al cargar artículos del servidor: ' + err)
    //     mensajeBajoFiltros('No estás viendo todos los artículos: hubo un error al cargar los artículos del servidor')
    // }
    
    // if(dbCards.length) allCards = [...dbCards, ...localCards]
    //     else allCards = localCards
    // cardsActuales = allCards
}
async function cargarDatosApiYAplicarFiltros(){
    try{
        const responseDbCards = await fetch(`${API_URL}/cards`, { method: 'GET', headers: {
            'Content-Type': 'application/json'
        }})
        if(!responseDbCards.ok) throw new Error('response not ok')
        dbCards = await responseDbCards.json()
        mensajeBajoFiltros('esconder', '')
    } catch (err){
        console.log('Error al cargar artículos del servidor: ' + err)
        mensajeBajoFiltros('error', 'No estás viendo todos los artículos: hubo un error al cargar los artículos del servidor')
    }
    
    if(dbCards.length) allCards = [...dbCards, ...localCards]
        else allCards = localCards
    cargando = false
    aplicarFiltros()
}

function mensajeBajoFiltros(status, msg) {
    const mensajeElemento = document.getElementById('p')
    if(status === 'error') {
        mensajeElemento.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="21"  height="21"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" /></svg>
        ${msg}`
        mensajeElemento.style.color = 'var(--color1)'
        mensajeElemento.style.display = 'flex'
    }
    else if(status === 'loading'){
        mensajeElemento.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-loader"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path d="M16.25 16.25l2.15 2.15" /><path d="M12 18l0 3" /><path d="M7.75 16.25l-2.15 2.15" /><path d="M6 12l-3 0" /><path d="M7.75 7.75l-2.15 -2.15" /></svg>
        ${msg}`
        mensajeElemento.style.color = 'var(--color5)'
        mensajeElemento.style.display = 'flex'
    } else{
        mensajeElemento.style.display = 'none'
    }
    mensajeElemento.className = 'mensajeBajoFiltros'
    mensajeElemento.style.marginLeft = '5px'
    maxFilterContainer.after(mensajeElemento)
}

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

inputAgente.addEventListener('change', event => {
    if (!event.target.value) {
        resetHabilidad()
    } else {
        inputHabilidad.disabled = false

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
    }
    aplicarFiltros()
    revisarBasura()
})
// comento pq lo agrego en el principal
// inputAgente.addEventListener('change', event => {
//     inputHabilidad.disabled = !event.target.value
//     if (!event.target.value) inputHabilidad.value = ""
// })
inputComp.addEventListener('change', event => {
    inputMapa.value = ""
    inputMapa.disabled = event.target.checked
    aplicarFiltros()
    revisarBasura()
})
function resetHabilidad() {
    inputHabilidad.value = ""
    inputHabilidad.disabled = true
}
function resetMapa() {
    inputMapa.value = ""
    inputMapa.disabled = false
}

// cuando se toca la basura,
// si hay valores, anima


function vaciarInput(autorBool) {
    basura.style.animation = "none"
    basura.offsetWidth
    if (inputComp.checked || inputMapa.value || inputAgente.value || inputHabilidad.value){
        basura.style.animation = "shake2 0.5s ease-in-out"
        basura.style.color = "#D8C99B"
        resetHabilidad()
        resetMapa()
        inputAgente.value = ""
        inputComp.checked = false
        aplicarFiltros()
    }
    if (autorBool) {
        inputAutor.value = ''
        inputAutor.dispatchEvent(new Event('input'));
        aplicarFiltros()
    }
    // revisarBasura()
}
function revisarBasura() {
    basura.style.animation = "none"
    basura.offsetWidth
    if (inputComp.checked || inputMapa.value || inputAgente.value || inputHabilidad.value){
        basura.style.animation = "shake 0.5s ease-in-out"
        basura.style.color = "#BD632F"
    }
    else {
        basura.style.animation = "shake2 0.5s ease-in-out"
        basura.style.color = "#D8C99B"
    }
}
inputMapa.addEventListener('change', () => {
    aplicarFiltros()
    revisarBasura()
})
// comento pq lo agrego en el principal
// inputAgente.addEventListener('change', event => {
//     aplicarFiltros()
//     revisarBasura()
// })
inputHabilidad.addEventListener('change', () => {
    aplicarFiltros()
    revisarBasura()
})
// inputComp.addEventListener('change', event => {
//     aplicarFiltros()
//     revisarBasura()
// })
inputAutor.addEventListener('input', event => {
    if(event.target.value){
        vaciarAutor.style.display = 'block'
        vaciarAutor.setAttribute('tabindex', '0')
    } else {
        vaciarAutor.style.display = 'none'
        vaciarAutor.setAttribute('tabindex', '-1')
    }
    aplicarFiltros()
})
vaciarAutor.addEventListener('click', event => {
    inputAutor.value = ''
    inputAutor.dispatchEvent(new Event('input'));
    inputAutor.focus()
})
// vaciarAutor.style.display = 'none'
//     aplicarFiltros()


function aplicarFiltros() {
    cardsActuales = allCards
    if (inputComp.checked) cardsActuales = cardsActuales.filter(card => compMaps.includes(card.mapa))
    else if (inputMapa.value) cardsActuales = cardsActuales.filter(card => card.mapa === inputMapa.value)
    if (inputAgente.value) cardsActuales = cardsActuales.filter(card => card.agente === inputAgente.value)
    if (inputHabilidad.value) cardsActuales = cardsActuales.filter(card => card.habilidad === inputHabilidad.value)
    if (inputAutor.value) cardsActuales = cardsActuales.filter(card => card.nombre.toLowerCase().includes(inputAutor.value.toLowerCase()))
    generarCards(cardsActuales, agentes, mapas)
    if (cardsActuales.length === 0) maxContainer.innerHTML += `<div class="no-result">
    <h2 class="mapa-titulo" style="margin-bottom: 10px; color: #BD632F;">No se encontró ningún resultado :(</h2>
    <span class="mi-link" onclick="vaciarInput(true)">Borrar todas las condiciones de búsqueda</span>
    </div>`
}
formHb.addEventListener('submit', event => {
    event.preventDefault()
})
function generarCards(cards, agentes, mapas) {
    if(cargando) maxContainer.innerHTML = `<div class="cargandoContainer"><div class="spinnerHb"></div><h2>Cargando...</h2></div>`
        else maxContainer.innerHTML = ""
    let division = devolverDivision()
    if (division === "agente") {
        const agentesYVacio = [...agentes, {nombre: "", habilidades: { h1: "", h2: "", h3: "", h4: ""}}]
        agentesYVacio.map(agente => {
            const cardsDe1Agente = cards.filter(card => card.agente === agente.nombre)
            cardsDe1Agente.sort((a, b) => a.mapa.localeCompare(b.mapa))
            if (cardsDe1Agente.length > 0) {
                let agenteContainer;
                if(agente.nombre){
                    maxContainer.innerHTML += `<h2 class="mapa-titulo">${capitalizeFirstLetter(agente.nombre)}</h2>
                        <div class="card-container" id="${agente.nombre}-container"></div>`
                    agenteContainer = document.getElementById(`${agente.nombre}-container`)
                } else{
                    maxContainer.innerHTML += `<h2 class="mapa-titulo">Agente no especificado</h2>
                        <div class="card-container" id="undefined-container"></div>`
                    agenteContainer = document.getElementById('undefined-container')
                }
                    cardsDe1Agente.map((card, index) => {
                        let mapHtml = ''
                        if (card.mapSrc && card.mapSrc.trim() !== '') {
                            mapHtml = `<img class="map" src="${card.mapSrc}" loading="lazy">`
                        }
                        let cardHtml = `<article class="card">
                                <p class="title">
                                    <span class="title-num">${index + 1}</span>
                                    <span class="title-text">${card.mapa.toUpperCase()}</span>
                                </p>
                                ${mapHtml}
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
            const mapasYVacio = [...mapas, {nombre: "", compPool: false}]
            mapasYVacio.map(mapa => {
                const cardsDe1Mapa = cards.filter(card => card.mapa === mapa.nombre)
                cardsDe1Mapa.sort((a, b) => a.agente.localeCompare(b.agente))
                if (cardsDe1Mapa.length > 0) {
                    let mapaContainer;
                    if(mapa.nombre){
                        maxContainer.innerHTML += `<h2 class="mapa-titulo">${capitalizeFirstLetter(mapa.nombre)}</h2>
                            <div class="card-container" id="${mapa.nombre}-container"></div>`
                        mapaContainer = document.getElementById(`${mapa.nombre}-container`)
                    } else{
                        maxContainer.innerHTML += `<h2 class="mapa-titulo">Mapa no especificado</h2>
                            <div class="card-container" id="undefined-container"></div>`
                        mapaContainer = document.getElementById('undefined-container')
                    }
                    cardsDe1Mapa.map((card, index) => {
                        let mapHtml = ''
                        if (card.mapSrc && card.mapSrc.trim() !== '') {
                            mapHtml = `<img class="map" src="${card.mapSrc}" loading="lazy">`
                        }
                        let cardHtml = `<article class="card">
                                <p class="title">
                                    <span class="title-num">${index + 1}</span>
                                    <span class="title-text">${card.agente.toUpperCase()}</span>
                                </p>
                                ${mapHtml}
                                <img class="pov" src="${card.povSrc}" loading="lazy">
                                <span class="title-text-user">${card.titleText}</span>
                                <p class="desc">${card.desc}</p>
                               <div class="firma">
                                    <span class="autor">${card.nombre} •</span>
                                    
                                    <span class="fecha-card">${new Date(card.fecha).toLocaleString('es-ES', opcionesfecha).replace(',', ' •')}</span>
                               </div>
                            </article>`
                        mapaContainer.innerHTML += cardHtml
                    })
                }
            })
        }
    }
}