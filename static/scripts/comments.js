const comentarioInput = document.getElementById('comentarios-derechos');
const passwordInput = document.getElementById('comentarios-contraseña');
const nombreInput = document.getElementById('comentarios-nombre');
const enviarBtn = document.querySelector('.boton-enviar-comentarios');
const listaComentarios = document.getElementById('lista-comentarios');
const estrellas = document.querySelectorAll('.estrellas .estrella');

let calificacionEstrella = 0;

function agregarComentario(nombre, comentario, contraseña, calificacionEstrella) {
    const nuevoComentario = {
        nombre: nombre,
        texto: comentario,
        password: contraseña,
        estrellas: calificacionEstrella,
        fecha: new Date().toLocaleDateString()
    };

    const li = document.createElement('li');
    const comentarioHeader = document.createElement('div');
    comentarioHeader.classList.add('comentario-header');

    const iconoPersona = document.createElement('img');
    iconoPersona.classList.add('icono-persona');
    iconoPersona.src = 'static/images/mobile-phone-app-icons/reaction/user.png';
    iconoPersona.alt = 'Icono Persona'; 

    const nombreElemento = document.createElement('div');
    nombreElemento.classList.add('comentario-nombre');
    nombreElemento.textContent = nombre;

    const iconoTresPuntos = document.createElement('button');
    iconoTresPuntos.classList.add('icono-tres-puntos');
    iconoTresPuntos.textContent = '⋮';

    const menuDesplegable = document.createElement('div');
    menuDesplegable.classList.add('menu-desplegable');
    menuDesplegable.style.display = 'none';  // Esto asegura que el menú esté oculto por defecto
    menuDesplegable.innerHTML = `
        <button class="editar-btn">Edit</button>
        <button class="eliminar-btn">Delete</button>
    `;

    comentarioHeader.appendChild(iconoPersona);
    comentarioHeader.appendChild(nombreElemento);
    comentarioHeader.appendChild(iconoTresPuntos);
    comentarioHeader.appendChild(menuDesplegable);

    const comentarioElemento = document.createElement('div');
    comentarioElemento.classList.add('comentario-texto');
    comentarioElemento.textContent = comentario;

    const estrellasElemento = document.createElement('div');
    estrellasElemento.classList.add('estrellas');
    for (let i = 1; i <= 5; i++) {
        const estrella = document.createElement('span');
        estrella.classList.add('estrella');
        estrella.textContent = '★';
        if (i <= calificacionEstrella) {
            estrella.classList.add('seleccionada');
        }
        estrellasElemento.appendChild(estrella);
    }

    const fechaElemento = document.createElement('div');
    fechaElemento.classList.add('fecha-comentario');
    fechaElemento.textContent = nuevoComentario.fecha;

    const estrellasYFechaElemento = document.createElement('div');
    estrellasYFechaElemento.classList.add('estrellas-y-fecha');
    estrellasYFechaElemento.appendChild(estrellasElemento);
    estrellasYFechaElemento.appendChild(fechaElemento);

    const iconosContenedor = document.createElement('div');
    iconosContenedor.classList.add('iconos-comentario');

    const nombresIconos = [
        'bubble_chat.png',
        'heart.png',
        'save.png',
        'share.png'
    ];

    nombresIconos.forEach(nombreArchivo => {
        const icono = document.createElement('img');
        icono.src = `static/images/mobile-phone-app-icons/reaction/${nombreArchivo}`;
        icono.alt = nombreArchivo.split('.')[0];
        iconosContenedor.appendChild(icono);
    });

    li.appendChild(comentarioHeader);
    li.appendChild(estrellasYFechaElemento);
    li.appendChild(comentarioElemento);
    li.appendChild(iconosContenedor);

    listaComentarios.prepend(li);

    const editarBtn = menuDesplegable.querySelector('.editar-btn');
    const eliminarBtn = menuDesplegable.querySelector('.eliminar-btn');

    editarBtn.addEventListener('click', () => {
        const userPassword = prompt('Enter your password to edit this comment (edit):');
        if (userPassword === nuevoComentario.password) {
            const nuevoTexto = prompt('Edit your comment:', comentario);
            if (nuevoTexto) {
                nuevoComentario.texto = nuevoTexto;
                comentarioElemento.textContent = nuevoTexto;
            }
        } else {
            alert('Incorrect password!');
        }
    });

    eliminarBtn.addEventListener('click', () => {
        const userPassword = prompt('Enter your password to delete this comment (delete):');
        if (userPassword === nuevoComentario.password) {
            li.remove();
        } else {
            alert('Incorrect password!');
        }
    });

    iconoTresPuntos.addEventListener('mouseenter', (e) => {
        menuDesplegable.style.display = 'block';
    });

    menuDesplegable.addEventListener('mouseenter', () => {
        menuDesplegable.style.display = 'block';
    });

    menuDesplegable.addEventListener('mouseleave', () => {
        menuDesplegable.style.display = 'none';
    });

    iconoTresPuntos.addEventListener('click', (e) => {
        menuDesplegable.style.display = (menuDesplegable.style.display === 'block') ? 'none' : 'block';
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.comentario-header')) {
            document.querySelectorAll('.menu-desplegable').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
}

function agregarComentariosPorDefecto() {
    agregarComentario(
        "Juan Pérez",
        "¡Me sorprendió lo fácil que es usar la página! Desde que la descubrí, he encontrado todo lo que necesito en minutos. La interfaz es súper amigable y se nota que se ha pensado en la experiencia del usuario. Definitivamente una de las mejores que he probado.",
        "password123",
        5
    );

    agregarComentario(
        "María López",
        "La página está muy bien hecha. La información se encuentra de manera clara y ordenada. Además, es tan rápida que me hace ahorrar mucho tiempo. ¡Sin duda, la recomiendo!",
        "password456",
        4
    );

    agregarComentario(
        "Carlos García",
        "¡Increíble! La funcionalidad es impresionante. Me encanta cómo todo está tan bien estructurado, y lo que más valoro es lo fácil que es navegar entre las distintas secciones.",
        "password789",
        3
    );

    agregarComentario(
        "Ana Rodríguez",
        "Una página que realmente hace todo más sencillo. Me ha sido muy útil para mis proyectos y el diseño es muy intuitivo. No tengo que perder tiempo buscando las herramientas que necesito, todo está a la mano.",
        "password1011",
        3
    );

    agregarComentario(
        "Luis Fernández",
        "Me encanta cómo la página se adapta a diferentes dispositivos. Puedo acceder a ella desde mi teléfono sin problemas, lo que la hace mucho más accesible. Además, la velocidad de carga es excelente.",
        "password1213",
        5
    );
}

enviarBtn.addEventListener('click', () => {
    const nombre = nombreInput.value;
    const comentario = comentarioInput.value;
    const contraseña = passwordInput.value;

    if (nombre && comentario && contraseña && calificacionEstrella > 0) {
        agregarComentario(nombre, comentario, contraseña, calificacionEstrella);
        nombreInput.value = '';
        comentarioInput.value = '';
        passwordInput.value = '';
        calificacionEstrella = 0;
    } else {
        alert('Please fill in all fields and select a star rating');
    }
});

estrellas.forEach(estrella => {
    estrella.addEventListener('click', () => {
        calificacionEstrella = parseInt(estrella.dataset.valor);
        estrellas.forEach(star => {
            star.classList.remove('seleccionada');
        });
        for (let i = 0; i < calificacionEstrella; i++) {
            estrellas[i].classList.add('seleccionada');
        }
    });
});

agregarComentariosPorDefecto();

document.getElementById('clear-btn').addEventListener('click', () => {
    nombreInput.value = '';
    comentarioInput.value = '';
    passwordInput.value = '';

    estrellas.forEach(estrella => {
        estrella.classList.remove('seleccionada');
    });

    calificacionEstrella = 0;
});