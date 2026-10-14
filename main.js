/* Henry's Hangman — reto del programa Oracle ONE / Alura.
 *
 * Se juega con un teclado en pantalla: cada letra se pulsa una sola vez y
 * queda marcada como acertada o fallada, así no hace falta recordar lo que ya
 * se ha probado ni escribir letra por letra.
 */

const MAX_FALLOS = 6;
const LETRAS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

const PALABRAS_BASE = [
  'ESFERA', 'JUSTICIA', 'BATMAN', 'EXTREMO', 'SPIDERMAN',
  'FARMACIA', 'SUPERMERCADO', 'PERU', 'ARGENTINA', 'AZUL',
  'CORONAVIRUS', 'SOLEADO', 'HELADO', 'EXTRAVAGANTE', 'AGRICULTURA',
  'REFORMA', 'EMOTIVO', 'SORTEO', 'CANADA', 'UNIVERSO',
  'INTERPOL', 'FANTASMA', 'MISTERIO', 'HUMOR', 'LLUVIA',
];

// Copia de trabajo: las palabras que añade quien juega se suman aquí.
let palabras = [...PALABRAS_BASE];

// Estado de la partida. Se reinicia entero en cada ronda — antes las variables
// eran globales y no se limpiaban, así que la segunda partida arrastraba los
// huecos y los fallos de la primera.
let palabra = '';
let acertadas = new Set();
let falladas = new Set();
// Hay dos formas de jugar una letra (botón y teclado físico). Deshabilitar
// los botones no basta: sin esta bandera, seguir tecleando tras perder
// sumaba fallos por encima del máximo y pedía una imagen inexistente.
let terminada = false;

const $ = (id) => document.getElementById(id);

const pantallaInicio = $('inicio');
const pantallaJuego  = $('juego');
const teclado        = $('teclado');

// --- Utilidades ----------------------------------------------------------

/** Quita acentos y pasa a mayúsculas: "canción" -> "CANCION". */
function normalizar(texto) {
  return texto
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function esPalabraValida(texto) {
  return /^[A-ZÑ]{3,20}$/.test(texto);
}

// --- Pintado -------------------------------------------------------------

function pintarPalabra() {
  $('palabra').textContent = [...palabra]
    .map((letra) => (acertadas.has(letra) ? letra : '_'))
    .join(' ');
}

function pintarFallos() {
  const n = falladas.size;
  $('dibujo').src = n === 0 ? 'img/0.jpg' : `img/${n}.PNG`;
  $('estado-fallos').textContent = `Fallos: ${n} de ${MAX_FALLOS}`;
  $('falladas').textContent = n ? [...falladas].join(' · ') : '—';
}

function construirTeclado() {
  teclado.textContent = '';
  for (const letra of LETRAS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tecla';
    b.textContent = letra;
    b.dataset.letra = letra;
    b.addEventListener('click', () => jugarLetra(letra));
    teclado.appendChild(b);
  }
}

function marcarTecla(letra, clase) {
  const tecla = teclado.querySelector(`[data-letra="${letra}"]`);
  if (tecla) {
    tecla.classList.add(clase);
    tecla.disabled = true;
  }
}

function bloquearTeclado() {
  teclado.querySelectorAll('.tecla').forEach((t) => (t.disabled = true));
}

// --- Partida -------------------------------------------------------------

function nuevaPartida() {
  palabra = palabras[Math.floor(Math.random() * palabras.length)];
  acertadas = new Set();
  falladas = new Set();
  terminada = false;

  construirTeclado();
  pintarPalabra();
  pintarFallos();

  $('resultado').textContent = '';
  $('resultado').dataset.tipo = '';
  $('btn-otra').hidden = true;

  pantallaInicio.hidden = true;
  pantallaJuego.hidden = false;
}

function jugarLetra(letra) {
  if (terminada) return;
  if (acertadas.has(letra) || falladas.has(letra)) return;

  if (palabra.includes(letra)) {
    acertadas.add(letra);
    marcarTecla(letra, 'tecla--acierto');
    pintarPalabra();

    const completa = [...palabra].every((l) => acertadas.has(l));
    if (completa) terminar(true);
  } else {
    falladas.add(letra);
    marcarTecla(letra, 'tecla--fallo');
    pintarFallos();

    if (falladas.size >= MAX_FALLOS) terminar(false);
  }
}

function terminar(gana) {
  terminada = true;
  bloquearTeclado();
  $('btn-otra').hidden = false;

  const r = $('resultado');
  if (gana) {
    r.textContent = '¡Ganaste! Adivinaste la palabra.';
    r.dataset.tipo = 'ok';
  } else {
    r.textContent = `Se acabó. La palabra era ${palabra}.`;
    r.dataset.tipo = 'error';
    // Al perder se descubre la palabra completa.
    $('palabra').textContent = [...palabra].join(' ');
  }
}

// --- Añadir palabras -----------------------------------------------------

function actualizarCuenta() {
  $('cuenta').textContent = String(palabras.length);
}

function avisar(mensaje, tipo) {
  const a = $('aviso-anadir');
  a.textContent = mensaje;
  a.dataset.tipo = tipo || '';
}

$('btn-anadir').addEventListener('click', () => {
  const campo = $('nueva-palabra');
  const limpia = normalizar(campo.value);

  if (!limpia) {
    return avisar('Escribe una palabra primero.', 'error');
  }
  if (!esPalabraValida(limpia)) {
    // Antes se aceptaba cualquier cosa: una palabra en minúsculas o con
    // numeros entraba en la lista y luego era imposible de adivinar.
    return avisar('Solo letras, entre 3 y 20 caracteres.', 'error');
  }
  if (palabras.includes(limpia)) {
    return avisar(`"${limpia}" ya estaba en la lista.`, 'error');
  }

  palabras.push(limpia);
  actualizarCuenta();
  avisar(`"${limpia}" añadida.`, 'ok');
  campo.value = '';
  campo.focus();
});

$('nueva-palabra').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('btn-anadir').click();
});

// --- Navegación ----------------------------------------------------------

$('btn-jugar').addEventListener('click', nuevaPartida);
$('btn-otra').addEventListener('click', nuevaPartida);

$('btn-salir').addEventListener('click', () => {
  pantallaJuego.hidden = true;
  pantallaInicio.hidden = false;
  avisar('');
});

// También se puede jugar con el teclado físico.
document.addEventListener('keydown', (e) => {
  if (pantallaJuego.hidden) return;
  const letra = normalizar(e.key);
  if (letra.length === 1 && LETRAS.includes(letra)) jugarLetra(letra);
});

actualizarCuenta();
$('ano').textContent = new Date().getFullYear();
