// inicar juego
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const reiniciar = document.getElementById('reiniciar')
const botonMacotaJugador = document.getElementById('boton-mascota')
const botonReiniciar = document.getElementById("boton-reiniciar")

// seleccionarMascotaJugador
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const spanMascotaJugador = document.getElementById('mascota-jugador')

// seleccionarMascotaEnemigo
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')

// revisarVidas
const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')

// Crearmensaje
const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-enemigo')

// crear mensaje final
// todas las variables de mensajefinal ya existian
//tarjetas
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

//mapa
const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let pokemones = []
let pokemonesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDePokemones
let inputCharmander
let inputCalmarno
let inputPikachu
let pokemonJugador
let pokemonJugadorObjeto
let ataquesPokemon
let ataquesPokemonEnemigo
let botonFuego
let botonAgua
let botonRayo
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './assets/pokemap.png'
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos


class Pokemon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0

    }

    pintarPokemon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let charmander = new Pokemon('CHARMANDER','./assets/charmander.png',5, './assets/headcharmander.png')
let calmarno = new Pokemon('SQUIRTLE','./assets/Squirtle.png',5, './assets/headSquirtle.png')
let pikachu = new Pokemon('PIKACHU','./assets/pikachu.png',5, './assets/headpikachu.png' )

// arreglo de pokemones enemigos

const CHARMANDER_ATAQUES = [
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '⚡', id: 'boton-rayo'},
]

charmander.ataques.push(...CHARMANDER_ATAQUES)

const CALMARNO_ATAQUES = [
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '🔥', id: 'boton-fuego'},
    { nombre: '⚡', id: 'boton-rayo'},
]

calmarno.ataques.push(...CALMARNO_ATAQUES)

const PIKACHU_ATAQUES = [
    { nombre: '⚡', id: 'boton-rayo'},
    { nombre: '⚡', id: 'boton-rayo'},
    { nombre: '⚡', id: 'boton-rayo'},
    { nombre: '💧', id: 'boton-agua'},
    { nombre: '🔥', id: 'boton-fuego'},
]
pikachu.ataques.push(...PIKACHU_ATAQUES)

pokemones.push(charmander,calmarno,pikachu)

function iniciarJuego() {
    reiniciar.style.display = 'none'
    sectionSeleccionarAtaque.style.display = 'none'

    sectionVerMapa.style.display = 'none'

    pokemones.forEach((pokemon) => {
        opcionDePokemones = `
        <input type="radio" name="macotas" id=${pokemon.nombre} />
            <label class="tarjeta-pokemon" for=${pokemon.nombre}>
                <p>${pokemon.nombre}</p>
                <img src=${pokemon.foto} alt=${pokemon.nombre}>
            </label>
        `
        contenedorTarjetas.innerHTML += opcionDePokemones
        inputCharmander = document.getElementById('CHARMANDER')
        inputCalmarno = document.getElementById('SQUIRTLE')
        inputPikachu = document.getElementById('PIKACHU')
    })
    botonMacotaJugador.addEventListener('click', seleccionarMascotaJugador)

    botonReiniciar.addEventListener('click', reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://localhost:8090/unirse")
        .then(function (res){
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function seleccionarMascotaJugador(){

    //alert('SELECCIONASTE TU MASCOTA')

    //condicional

    if (inputCharmander.checked){
        spanMascotaJugador.innerHTML = inputCharmander.id
        pokemonJugador = inputCharmander.id
    } else if (inputCalmarno.checked){
        spanMascotaJugador.innerHTML = inputCalmarno.id
        pokemonJugador = inputCalmarno.id
    } else if (inputPikachu.checked){
        spanMascotaJugador.innerHTML = inputPikachu.id
        pokemonJugador = inputPikachu.id
    } else {
        alert ('No seleccionaste tu POKEMON!')
        return
    }
    
    sectionSeleccionarMascota.style.display = 'none'

    seleccionarPokemon(pokemonJugador)

    extraerAtaques(pokemonJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
    
}

function seleccionarPokemon(pokemonJugador) {
    fetch(`http://localhost:8090/pokemon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pokemon: pokemonJugador 
        })
    })
}

function extraerAtaques(pokemonJugador){
    let ataques
    for (let i = 0; i < pokemones.length; i++) {
        if (pokemonJugador === pokemones[i].nombre) {
            ataques = pokemones[i].ataques
        }
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque) => {
        ataquesPokemon = `<button id=${ataque.id} class="btn-ataques bAtaque">${ataque.nombre}</button>`
        
        contenedorAtaques.innerHTML += ataquesPokemon
    })
    
    botonFuego = document.getElementById("boton-fuego")
    botonAgua = document.getElementById("boton-agua")
    botonRayo = document.getElementById("boton-rayo")
//ARREGLO DE BOTONES
    botones = document.querySelectorAll('.bAtaque')
//addeventlistener, se quito porque la secuencia ataque la reemplaza
}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.textContent === '🔥') {
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }   else if (e.target.textContent === '💧') {
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }   else {
                ataqueJugador.push('RAYO')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }
            if (ataqueJugador.length === 5){
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques() {
    fetch(`http://localhost:8090/pokemon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://localhost:8090/pokemon/${enemigoId}/ataques`)
    .then(function(res){
        if (res.ok) {
            res.json()
                .then(function({ ataques }){
                    if (ataques.length === 5) {
                        ataqueEnemigo = ataques
                        combate()
                    }
                })
        }
    })
}

function seleccionarMascotaEnemigo(enemigo){
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesPokemonEnemigo = enemigo.ataques
    secuenciaAtaque()
}

function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio(0, ataquesPokemonEnemigo.length -1)
    
    if(ataqueAleatorio == 0 || ataqueAleatorio == 1){
        ataqueEnemigo.push('FUEGO')
    }   else if (ataqueAleatorio == 3 || ataqueAleatorio == 4){
        ataqueEnemigo.push('AGUA')
    }   else {
        ataqueEnemigo.push('RAYO')
    }
    console.log(ataqueEnemigo)
    iniciarPelea()
}

function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponentes(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate(){
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === ataqueEnemigo[index]) {
            indexAmbosOponentes(index, index)
            crearMensaje("EMPATE")
        } else if(ataqueJugador[index] === 'FUEGO' && ataqueEnemigo[index] === 'RAYO') {
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === 'AGUA' && ataqueEnemigo[index] === 'FUEGO') {
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] === 'RAYO' && ataqueEnemigo[index] === 'AGUA') {
            indexAmbosOponentes(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosOponentes(index, index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo
        }
        
    }
    revisarVidas()
}

function revisarVidas(){
    if (victoriasJugador === victoriasEnemigo){
        //EMPATE
        crearMensajeFinal("esto fue un empate")
    } else if (victoriasJugador > victoriasEnemigo){
        //GANASTE PAPI
        crearMensajeFinal("Ganamos")
        //PERDISTE NEAA
    } else {
        crearMensajeFinal("Perdimos, gano el enemigo")
    }
}

function crearMensaje(resultado){


    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    
    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function crearMensajeFinal(resultadoFinal){


    sectionMensajes.innerHTML = resultadoFinal
    reiniciar.style.display = 'flex'
}

function reiniciarJuego(){
    location.reload()
}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas() {

    pokemonJugadorObjeto.x = pokemonJugadorObjeto.x + pokemonJugadorObjeto.velocidadX
    pokemonJugadorObjeto.y = pokemonJugadorObjeto.y + pokemonJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    pokemonJugadorObjeto.pintarPokemon()

    enviarPosicion(pokemonJugadorObjeto.x, pokemonJugadorObjeto.y)

    pokemonesEnemigos.forEach(function(pokemon) {
        pokemon.pintarPokemon()
        revisarColision(pokemon)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://localhost:8090/pokemon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
        .then(function(res) {
            if (res.ok) {
                res.json()
                    .then(function ({ enemigos }) {
                        console.log(enemigos)
                        pokemonesEnemigos = enemigos.map(function(enemigo){
                            let pokemonEnemigo = null       
                            const pokemonNombre = enemigo.pokemon.nombre || ""
                            if (pokemonNombre === "CHARMANDER" ) {
                                pokemonEnemigo = new Pokemon('CHARMANDER','./assets/charmander.png',5, './assets/headcharmander.png', enemigo.id)
                            } else if (pokemonNombre === "SQUIRTLE" ) {
                                pokemonEnemigo = new Pokemon('SQUIRTLE','./assets/Squirtle.png',5, './assets/headSquirtle.png', enemigo.id)
                            } else if (pokemonNombre === "PIKACHU") {
                                pokemonEnemigo = new Pokemon('PIKACHU','./assets/pikachu.png',5, './assets/headpikachu.png', enemigo.id)
                            }

                            pokemonEnemigo.x = enemigo.x
                            pokemonEnemigo.y = enemigo.y

                            
                            return pokemonEnemigo
                        })
                    })
            }
        })
}

function moverIzquierda() {
    pokemonJugadorObjeto.velocidadX = -5
    pintarCanvas()
}
function moverDerecha() {
    pokemonJugadorObjeto.velocidadX = 5
}
function moverAbajo() {
    pokemonJugadorObjeto.velocidadY = 5
}

function moverArriba() {
    pokemonJugadorObjeto.velocidadY = -5
}

function detenerMovimiento() {

    pokemonJugadorObjeto.velocidadX = 0
    pokemonJugadorObjeto.velocidadY = 0
}

function teclaPresionada(event) {
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break;
        case 'ArrowDown':
            moverAbajo()
            break;
        case 'ArrowLeft':
            moverIzquierda()
            break;
        case 'ArrowRight':
            moverDerecha()
            break;    
        default:
            break;
    }
}

function iniciarMapa() {
    pokemonJugadorObjeto = obtenerObjetoPokemon(pokemonJugador)
    console.log(pokemonJugadorObjeto, pokemonJugador);
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', teclaPresionada)

    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoPokemon() {
    for (let i = 0; i < pokemones.length; i++) {
        if (pokemonJugador === pokemones[i].nombre) {
            return pokemones[i]
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    // jugador
    const arribaPokemon = 
        pokemonJugadorObjeto.y
    const abajoPokemon = 
        pokemonJugadorObjeto.y + pokemonJugadorObjeto.alto
    const derechaPokemon = 
        pokemonJugadorObjeto.x + pokemonJugadorObjeto.ancho
    const izquierdaPokemon = 
        pokemonJugadorObjeto.x

    if (abajoPokemon < arribaEnemigo||
        arribaPokemon > abajoEnemigo ||
        derechaPokemon < izquierdaEnemigo ||
        izquierdaPokemon > derechaEnemigo) {
        return;
    }

    detenerMovimiento()
    clearInterval(intervalo)
    console.log('se detecto una colision');

    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
    // alert("Hay colision con " + enemigo.nombre)
}
window.addEventListener('load', iniciarJuego)

