let palabras = [];

// Cargar las palabras directamente desde la constante 'words_table' definida en 'datos.js' y agruparlas de 3 en 3
function cargarPalabras() {
  try {
    // Agrupar las palabras en grupos de 3
    for (let i = 0; i < words_table.length; i += 3) {
      palabras.push([
        words_table[i], 
        words_table[i + 1] || {},  // Si no hay palabra, se usa un objeto vacío
        words_table[i + 2] || {}
      ]);
    }
    console.log(palabras);
    actualizarInterfaz();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Recibe la lista de palabras y la utiliza para actualizar la interfaz
function actualizarInterfazConNuevasPalabras(nuevasPalabras) {
  palabras = []; // Limpia la lista existente
  for (let i = 0; i < nuevasPalabras.length; i += 3) {
    palabras.push([
      nuevasPalabras[i],
      nuevasPalabras[i + 1] || {}, // Si no hay palabra, se usa un objeto vacío
      nuevasPalabras[i + 2] || {}
    ]);
  }
  console.log('Nueva lista de palabras:', palabras);
  actualizarInterfaz(); // Llama a la función que actualiza la interfaz con la nueva lista
}

// Función para actualizar la interfaz
function actualizarInterfaz() {
  document.getElementById('primero').textContent = 1;
  document.getElementById('ultimo').textContent = palabras.length;
  updateDinamicos();
  mostrarPalabras(index); // Cambié a mostrarPalabras
  updateActiveButton();
}

document.addEventListener('DOMContentLoaded', () => {
  cargarPalabras();
});

let index = 0;
let dynamicIndexStart = 1;

const buttons = document.querySelectorAll('button');
const informacionPalabra = document.getElementById('informacion-palabras');  
const dinamicoButtons = document.querySelectorAll('button:nth-child(n+3):nth-child(-n+5)');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

function updateDinamicos() {
  for (let i = 0; i < 3; i++) {
    if (dynamicIndexStart + i < palabras.length - 1) {
      dinamicoButtons[i].textContent = dynamicIndexStart + i + 1;
      dinamicoButtons[i].disabled = false;
    } else {
      dinamicoButtons[i].textContent = '';
      dinamicoButtons[i].disabled = true;
    }
  }
}

function updateActiveButton() {
  buttons.forEach(b => b.classList.remove('active'));
  if (index === 0) {
    document.getElementById('primero').classList.add('active');
  } else if (index === palabras.length - 1) {
    document.getElementById('ultimo').classList.add('active');
  } else {
    const dynamicButton = Array.from(dinamicoButtons).find(b => parseInt(b.textContent) - 1 === index);
    if (dynamicButton) {
      dynamicButton.classList.add('active');
    }
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.id === "primero") {
      index = 0;
      dynamicIndexStart = 1;
    } else if (button.id === "ultimo") {
      index = palabras.length - 1;
      dynamicIndexStart = palabras.length - 4;
    } else if (button.textContent === "next") {
      if (index < palabras.length - 1) {
        index++;
        if (index === dynamicIndexStart + 2 && dynamicIndexStart + 3 < palabras.length - 1) {
          dynamicIndexStart++;
        }
      }
    } else if (button.textContent === "prev") {
      if (index > 0) {
        index--;
        if (index === dynamicIndexStart && dynamicIndexStart > 1) {
          dynamicIndexStart--;
        }
      }
    }

    mostrarPalabras(index); 
    updateDinamicos();
    updateActiveButton();
  });
});

dinamicoButtons.forEach(button => {
  button.addEventListener('click', () => {
    const buttonIndex = parseInt(button.textContent) - 1;
    index = buttonIndex;
    mostrarPalabras(buttonIndex); 
    updateDinamicos();
    updateActiveButton();
  });
});

prevButton.addEventListener('click', () => {
  if (index > 0) {
    index--;
    if (index === dynamicIndexStart && dynamicIndexStart > 1) {
      dynamicIndexStart--;
    }
  }

  mostrarPalabras(index); 
  updateDinamicos();
  updateActiveButton();
});

nextButton.addEventListener('click', () => {
  if (index < palabras.length - 1) {
    index++;
    if (index === dynamicIndexStart + 2 && dynamicIndexStart + 3 < palabras.length - 1) {
      dynamicIndexStart++;
    }
  }

  mostrarPalabras(index);
  updateDinamicos();
  updateActiveButton();
});

function moveDinamicosRight() {
  if (dynamicIndexStart + 3 < palabras.length - 1) {
    dynamicIndexStart++;
    updateDinamicos();
    updateActiveButton();
  }
}

function moveDinamicosLeft() {
  if (dynamicIndexStart > 1) {
    dynamicIndexStart--;
    updateDinamicos();
    updateActiveButton();
  }
}

// Mostrar tres palabras a la vez
function mostrarPalabras(index) {
    const palabrasMostrar = palabras[index];
    let contenido = "";
  
    palabrasMostrar.forEach(palabra => {
      // Verificar si la palabra existe. Si no, usar un objeto vacío o una cadena vacía.
      if (!palabra) {
        contenido += `
          <div>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
          </div>
        `;
      } else {
        contenido += `
          <div class="contenido">
            <div class="contenido-izquierdo">
                <span class="texto">Aa</span>
            </div>
            <div class="contenido-derecho">
                <p class="palabra">${(palabra.nombre || '').toLowerCase()}</p>
                <p class="categoria">(<i>${(palabra.idioma || '').toLowerCase()}, ${(palabra.categoria || '').toLowerCase()})</i></p>
                <p class="descripcion">${(palabra.descripcion || '').toLowerCase()}</p>
                <p class="fecha-ingreso">${(palabra.fecha_agregado || '').toLowerCase()}</p>
            </div>
          </div>
        `;
      }
    });
  
    informacionPalabra.innerHTML = contenido;
  }
  
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('primero').textContent = 1;
  document.getElementById('ultimo').textContent = palabras.length;

  updateDinamicos();
  mostrarPalabras(index);
  updateActiveButton();
});

dinamicoButtons[0].addEventListener('click', moveDinamicosLeft);
dinamicoButtons[2].addEventListener('click', moveDinamicosRight);
