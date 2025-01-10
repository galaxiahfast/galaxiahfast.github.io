const formulario = document.getElementById('formulario-palabras');

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre-palabra').value.trim();
    const idioma = document.getElementById('idioma-palabra').value.trim();
    const categoria = document.getElementById('categoria-palabra').value.trim();
    const descripcion = document.getElementById('descripcion-palabra').value.trim();

    if (!nombre || !idioma || !categoria || !descripcion) {
        alert('Todos los campos deben estar llenos para agregar la palabra.');
        return;
    }

    if (!nombre.endsWith('*')) {
        return;
    }

    const nombreSinAsterisco = nombre.slice(0, -1);

    // Verifica si la palabra ya existe en la lista
    const palabraExistente = words_table.some(palabra => palabra.nombre === nombreSinAsterisco);

    if (palabraExistente) {
        alert('La palabra ya ha sido agregada anteriormente.');
        return;
    }

    const fechaActual = new Date().toISOString().split('T')[0];

    const nuevaPalabra = {
        nombre: nombreSinAsterisco,
        idioma: idioma,
        categoria: categoria,
        descripcion: descripcion,
        fecha_agregado: fechaActual
    };

    words_table.push(nuevaPalabra);

    alert('Palabra agregada exitosamente: ' + JSON.stringify(nuevaPalabra));

    formulario.reset();
});
