let recognition;
let isRecording = false;
let inactivityTimer; // Temporizador para la inactividad
const INACTIVITY_LIMIT = 3000; // Tiempo de inactividad en milisegundos (3 segundos)

// Reconocimiento de voz
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    // Procesar resultados del reconocimiento de voz
    recognition.onresult = function(event) {
        clearTimeout(inactivityTimer);

        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        transcript = transcript.replace(/[.,!?;]$/, '').trim();
        document.getElementById('campo-de-busqueda').value = transcript;
        buscarSugerencias();

        inactivityTimer = setTimeout(() => {
            recognition.stop();
            isRecording = false;
            document.getElementById('boton-microfono').style.backgroundColor = '';
            const palabraEscrita = document.getElementById('campo-de-busqueda').value; // Obtener la palabra escrita
            if (palabraEscrita) {
                obtenerPalabras(palabraEscrita);
            }
            document.getElementById('resultados-busqueda').style.display = 'none';
        }, INACTIVITY_LIMIT);
    };

    // Manejo cuando el reconocimiento finaliza
    recognition.onend = function() {
        isRecording = false;
        document.getElementById('boton-microfono').style.backgroundColor = '';
        clearTimeout(inactivityTimer);
    };
} else {
    alert("Tu navegador no soporta el reconocimiento de voz.");
}

// Manejo del botón de micrófono
document.getElementById('boton-microfono').addEventListener('click', function(event) {
    event.stopPropagation();
    if (isRecording) {
        recognition.stop();
        clearTimeout(inactivityTimer);
    } else {
        recognition.start();
        document.getElementById('boton-microfono').style.backgroundColor = 'lightgreen';

        inactivityTimer = setTimeout(() => {
            recognition.stop();
            isRecording = false;
            document.getElementById('boton-microfono').style.backgroundColor = '';
            const palabraEscrita = document.getElementById('campo-de-busqueda').value; // Obtener la palabra escrita
            if (palabraEscrita) {
                obtenerPalabras(palabraEscrita);
            }
        }, INACTIVITY_LIMIT);
    }
    isRecording = !isRecording;
});

// Función para buscar sugerencias
function buscarSugerencias() {
    const termino = document.getElementById('campo-de-busqueda').value;
    const resultadosDiv = document.getElementById('resultados-busqueda');
  
    if (termino.length > 0) {
      // Filtra las palabras de 'words_table' que contienen el término de búsqueda
      const resultados = words_table.filter(palabra => {
        return palabra.nombre.toLowerCase().includes(termino.toLowerCase());
      });
  
      if (resultados.length === 0) {
        resultadosDiv.style.display = 'none';
      } else {
        resultadosDiv.style.display = 'block';
        resultadosDiv.innerHTML = ''; // Limpiar resultados previos
  
        // Limitar los resultados a los primeros 5
        const resultadosLimitados = resultados.slice(0, 5);
  
        resultadosLimitados.forEach(palabra => {
          const div = document.createElement('div');
          div.className = 'resultado-item';
          div.textContent = palabra.nombre; // Mostrar solo el nombre de la palabra
  
          // Evento de clic para seleccionar una palabra
          div.addEventListener('click', function() {
            document.getElementById('campo-de-busqueda').value = palabra.nombre;
            window.location.hash = '#detalles-palabra';
            resultadosDiv.style.display = 'none';
            desactivarMicrofono();
            obtenerPalabras(palabra.nombre);
          });
  
          resultadosDiv.appendChild(div);
        });
      }
    } else {
      resultadosDiv.style.display = 'none';
    }
  }  

// Desactivar el micrófono
function desactivarMicrofono() {
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        document.getElementById('boton-microfono').style.backgroundColor = '';
    }
}


/*
function obtenerPalabras(palabraSeleccionada) {
    fetch('/obtener_palabras')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                let listaModificada = [...data];

                if (palabraSeleccionada) {
                    const palabraCoincidente = listaModificada.find(item => item.nombre.toLowerCase() === palabraSeleccionada.toLowerCase());
                    
                    if (palabraCoincidente) {
                        // Mueve la palabra seleccionada al inicio de la lista
                        const index = listaModificada.indexOf(palabraCoincidente);
                        listaModificada.splice(index, 1);
                        listaModificada.unshift(palabraCoincidente);
                    }
                }

                console.log('Lista modificada:', listaModificada);

                // Llama a la función en el segundo archivo para actualizar la interfaz
                actualizarInterfazConNuevasPalabras(listaModificada);
            } else {
                console.warn('La lista de palabras está vacía');
            }
        })
        .catch(error => console.error('Error al obtener palabras:', error));
}
*/


/*function obtenerPalabras(palabraSeleccionada) {
    fetch('/obtener_palabras')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                let listaModificada = [...data];

                if (palabraSeleccionada) {
                    // Eliminar tildes, mayúsculas y signos de puntuación
                    const limpiarPalabra = (palabra) => {
                        // Eliminar acentos
                        let palabraLimpia = palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        // Eliminar signos de puntuación
                        palabraLimpia = palabraLimpia.replace(/[.,!?;:()'"`-]/g, "");
                        // Convertir a minúsculas
                        return palabraLimpia.toLowerCase();
                    };

                    // Limpiar la palabra seleccionada por el usuario
                    const palabraSeleccionadaLimpia = limpiarPalabra(palabraSeleccionada);

                    // Encontrar coincidencias aproximadas usando la distancia de Levenshtein
                    const calcularDistanciaLevenshtein = (str1, str2) => {
                        const dp = Array(str1.length + 1).fill().map(() => Array(str2.length + 1).fill(0));

                        for (let i = 0; i <= str1.length; i++) {
                            for (let j = 0; j <= str2.length; j++) {
                                if (i === 0) dp[i][j] = j;
                                else if (j === 0) dp[i][j] = i;
                                else {
                                    dp[i][j] = Math.min(
                                        dp[i - 1][j] + 1,
                                        dp[i][j - 1] + 1,
                                        dp[i - 1][j - 1] + (str1[i - 1] === str2[j - 1] ? 0 : 1)
                                    );
                                }
                            }
                        }
                        return dp[str1.length][str2.length];
                    };

                    // Umbral para considerar una coincidencia aproximada
                    const umbralCoincidencia = 2; // Puedes ajustar este valor

                    // Filtrar las palabras que coinciden de manera exacta o aproximada
                    const palabrasCoincidentes = listaModificada.filter(item => {
                        const palabraLimpiar = limpiarPalabra(item.nombre);
                        const distancia = calcularDistanciaLevenshtein(palabraSeleccionadaLimpia, palabraLimpiar);
                        return distancia <= umbralCoincidencia;
                    });

                    // Si hay coincidencias exactas, mover la palabra seleccionada al inicio
                    const palabraCoincidente = palabrasCoincidentes.find(item => limpiarPalabra(item.nombre) === palabraSeleccionadaLimpia);
                    if (palabraCoincidente) {
                        const index = listaModificada.indexOf(palabraCoincidente);
                        listaModificada.splice(index, 1);
                        listaModificada.unshift(palabraCoincidente);
                    }
                }

                console.log('Lista modificada:', listaModificada);

                // Llama a la función en el segundo archivo para actualizar la interfaz
                actualizarInterfazConNuevasPalabras(listaModificada);
            } else {
                console.warn('La lista de palabras está vacía');
            }
        })
        .catch(error => console.error('Error al obtener palabras:', error));
}*/

function obtenerPalabras(palabraSeleccionada) {
    try {
      // Usamos directamente la variable 'words_table' desde 'datos.js'
      if (words_table.length > 0) {
        let listaModificada = [...words_table];
  
        // Siempre ordenamos la lista de palabras basada en la distancia de Levenshtein
        listaModificada.sort((a, b) => {
          // Normalizamos las palabras de la lista y la palabra seleccionada
          const palabraNormalizada = normalizarPalabra(palabraSeleccionada);
          const palabraA = normalizarPalabra(a.nombre);
          const palabraB = normalizarPalabra(b.nombre);
  
          // Calcula la distancia de Levenshtein entre la palabra seleccionada y las palabras de la lista
          const distanciaA = calcularDistanciaLevenshtein(palabraNormalizada, palabraA);
          const distanciaB = calcularDistanciaLevenshtein(palabraNormalizada, palabraB);
  
          return distanciaA - distanciaB; // Ordena de menor a mayor distancia
        });
  
        console.log('Lista modificada y ordenada:', listaModificada);
  
        // Llama a la función en el segundo archivo para actualizar la interfaz con la nueva lista ordenada
        actualizarInterfazConNuevasPalabras(listaModificada);
      } else {
        console.warn('La lista de palabras está vacía');
      }
    } catch (error) {
      console.error('Error al obtener palabras:', error);
    }
  }  

// Función para calcular la distancia de Levenshtein entre dos palabras
function calcularDistanciaLevenshtein(str1, str2) {
    const dp = Array(str1.length + 1).fill().map(() => Array(str2.length + 1).fill(0));

    for (let i = 0; i <= str1.length; i++) {
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) dp[i][j] = j; // Si la primera palabra está vacía, solo se pueden hacer inserciones
            else if (j === 0) dp[i][j] = i; // Si la segunda palabra está vacía, solo se pueden hacer eliminaciones
            else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1, // Eliminación
                    dp[i][j - 1] + 1, // Inserción
                    dp[i - 1][j - 1] + (str1[i - 1] === str2[j - 1] ? 0 : 1) // Sustitución
                );
            }
        }
    }
    return dp[str1.length][str2.length];
}

// Función para normalizar las palabras: elimina acentos, convierte a minúsculas y elimina signos de puntuación
function normalizarPalabra(palabra) {
    // Elimina acentos, convierte a minúsculas y elimina signos de puntuación
    return palabra
        .normalize('NFD')  // Descompone los caracteres con acento en caracteres base + acento
        .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
        .toLowerCase()  // Convierte todo a minúsculas
        .replace(/[^a-z0-9]/g, '');  // Elimina cualquier carácter no alfanumérico
}






// Cerrar el menú de búsqueda si se hace clic fuera de él o presiona la tecla ESC
document.addEventListener('click', function(event) {
    const resultadosDiv = document.getElementById('resultados-busqueda');
    const busquedaDiv = document.querySelector('.tercer-subcontenedor');
    const botonMicrofono = document.getElementById('boton-microfono');
    const campoBusqueda = document.getElementById('campo-de-busqueda');

    if (isRecording && !busquedaDiv.contains(event.target) && event.target !== botonMicrofono) {
        desactivarMicrofono();
    }

    if (!busquedaDiv.contains(event.target) && event.target !== campoBusqueda) {
        resultadosDiv.style.display = 'none';
    }
});

// Cerrar el menú de búsqueda con la tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const resultadosDiv = document.getElementById('resultados-busqueda');
        resultadosDiv.style.display = 'none';
        desactivarMicrofono();
        document.getElementById('campo-de-busqueda').blur();
    }
});

// Seleccionar todo el texto del campo de búsqueda al hacer clic
function seleccionarTexto() {
    const campoBusqueda = document.getElementById('campo-de-busqueda');
    if (campoBusqueda.value.length > 0) {
        campoBusqueda.select();
    }
}

/*
// Agregar el evento de la tecla "Enter" al campo de búsqueda
document.getElementById('campo-de-busqueda').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const termino = document.getElementById('campo-de-busqueda').value;
        if (termino) {
            obtenerPalabras(termino);
        }
    }
}); */

// Agregar el evento de la tecla "Enter" al campo de búsqueda
document.getElementById('campo-de-busqueda').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const termino = document.getElementById('campo-de-busqueda').value;
        const resultadosDiv = document.getElementById('resultados-busqueda'); // Selecciona la barra de sugerencias

        if (termino) {
            obtenerPalabras(termino); // Pasa el texto del campo de búsqueda
        }

        // Oculta la barra de sugerencias
        resultadosDiv.style.display = 'none';

        // Quita el foco del campo de búsqueda
        document.getElementById('campo-de-busqueda').blur();
    }
});

