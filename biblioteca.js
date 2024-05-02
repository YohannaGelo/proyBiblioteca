  //-----------------------------//
 //   --->     CLASES    <---   //
//-----------------------------//

class Usuario {

    constructor(nombreUsuario, apellido) {
        this.nombreUsuario = nombreUsuario;
        this.apellido = apellido;
        this.librosPrestados = [];
    }

}

//clase libro
class Libro {
    // Constructor de la clase Libro
    constructor(titulo, autor) {
        this.titulo = titulo;
        this.autor = autor;
    }

}


//clase biblioteca
class Biblioteca {

    constructor() {
        this.disponible = [];
        this.usuarios = [];
    }

    //agregar un nuevo usuario
    agregarUsuario(nombreUsuario, apellido) {

        // Normaliza el nombre de usuario y apellido
        const nombreUsuarioNormalizado = normalizarTexto(nombreUsuario);
        const apellidoNormalizado = normalizarTexto(apellido);

        //recupero la lista de usuarios locales
        const usuariosStorage = JSON.parse(localStorage.getItem('usuarios')) || [];

        //busco si el usuarioo ya existe
        let usuarioExistente = usuariosStorage.find(user =>
            normalizarTexto(user.nombreUsuario) === nombreUsuarioNormalizado &&
            normalizarTexto(user.apellido) === apellidoNormalizado
        );


        //si no se ha encontrado al usuario...
        if (!usuarioExistente) {
            const nuevoUsuario = new Usuario(nombreUsuario, apellido);
            usuariosStorage.push(nuevoUsuario); //se añade al array usuarios

            //se añade a localStorage
            localStorage.setItem('usuarios', JSON.stringify(usuariosStorage));

            alert("Usuario añadido correctamente");

            //actualiza el menú desplegable
            actualizarMenuDesplegable();

            //devolvemos el nuevo usuario
            return nuevoUsuario;

        } else {
            alert("El usuario ya existe.");
            return usuarioExistente;

        }

    }


    //listar usuarios
    listarTodosUsuarios() {
        //primero cierro la lista de libros disponibles por si está abierta
        const listaUsuarios = document.getElementById("librosDisponibles");
        listaUsuarios.innerHTML = "";

        const lista = document.getElementById("todosUsuarios"); // Obtiene el elemento del DOM donde se mostrará la lista.
        lista.innerHTML = ""; // Limpia la lista actual antes de mostrar la nueva.

        const titulo = document.createElement("h2"); //crea un nuevo elemento de encabezado para el título.
        titulo.textContent = "Usuarios de biblioteca";
        lista.appendChild(titulo);

        //recupera la lista de usuarios desde localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        if (usuarios.length > 0) {
            //recorre cada usuario
            usuarios.forEach(usuario => {
                const item = document.createElement("li"); // Crea un nuevo div para cada usuario

                //como en el array se guardan objetos, accedo al titulo del objeto
                let librosPrestados = usuario.librosPrestados.map(libro => libro.titulo).join("<br> · ");
                // item.textContent = `Usuario: ${usuario.nombreUsuario}, Libros prestados: ${librosPrestados}`;

                item.innerHTML = `<span class="marker"></span>👤 &nbsp;&nbsp;&nbsp;&nbsp;<font>Usuario:</font> ${usuario.nombreUsuario} ${usuario.apellido}<br>🕮 &nbsp;&nbsp;<font>Libros prestados:</font><br> · ${librosPrestados}<br><br><br>`;

                lista.appendChild(item); // Añade el div a la lista en el DOM.
            });

        } else {
            //si no hay usuarios, muestra un mensaje
            const sinUsuarios = document.createElement("p");
            sinUsuarios.textContent = "No hay usuarios disponibles.";
            lista.appendChild(sinUsuarios);
        }
    }

    //listar libros disponibles
    listarLibrosDisponibles() {
        //primero cierro la lista de usuarios por si está abierta
        const listaUsuarios = document.getElementById("todosUsuarios");
        listaUsuarios.innerHTML = "";

        const lista = document.getElementById("librosDisponibles"); // Obtiene el elemento del DOM donde se mostrará la lista.
        lista.innerHTML = ""; // Limpia la lista actual antes de mostrar la nueva

        const titulo = document.createElement("h2"); //crea un nuevo elemento de encabezado para el título.
        titulo.textContent = "Libros Disponibles";
        lista.appendChild(titulo);

        //recupera los libros disponibles del local storage
        const librosDisponibles = JSON.parse(localStorage.getItem('existenciaLibros'));

        //verificar si hay libros disponibles en el almacenamiento
        if (librosDisponibles && librosDisponibles.length > 0) {
            //recorre cada libro y mostrarlo en la lista
            librosDisponibles.forEach(libro => {
                const item = document.createElement("li");
                //se añade el contenido a mostrar en cada li
                item.innerHTML = `<span class="marker"></span>&nbsp; ✓ &nbsp;&nbsp;&nbsp;&nbsp;<font>Título:</font> ${libro.titulo}<br>👤 &nbsp;&nbsp;<font>Autor:</font> ${libro.autor}<br><br><br>`;
                lista.appendChild(item);
            });
        } else {
            //si no hay libros disponibles, muestra un mensaje
            const sinLibros = document.createElement("p");
            sinLibros.textContent = "No hay libros disponibles.";
            lista.appendChild(sinLibros);
        }

    }

    agregarLibro(titulo, autor) {

        const libroNuevo = new Libro(titulo, autor);

        this.disponible.push(libroNuevo);

        //añado el libro a una lista de almacenamiento local
        localStorage.setItem('existenciaLibros', JSON.stringify(this.disponible));

        //añade una entrada de blog
        this.agregarEntradaBlog(libroNuevo);

        alert("El libro se agregó correctamente");

    }

    prestarLibro(titulo, nombreUsuario, apellido) {

        //selecciona el elemento del DOM
        const listaUsuarios = document.getElementById("listaUsuarios");
        const usuarioSeleccionado = listaUsuarios.options[listaUsuarios.selectedIndex].value;

        // Normaliza el nombre de usuario y apellido
        const usuarioSeleccionadoNormalizado = normalizarTexto(usuarioSeleccionado);

        //recupero la lista de usuarios locales
        const usuariosStorage = JSON.parse(localStorage.getItem('usuarios')) || [];

        //busco si el usuarioo ya existe
        let usuarioConsultado = usuariosStorage.find(user =>
            normalizarTexto(user.nombreUsuario) + " " + normalizarTexto(user.apellido) === usuarioSeleccionadoNormalizado
        );

        if (!usuarioConsultado) {
            alert("El usuario no existe. Por favor, regístrese antes de prestar el libro.");
            return; //detiene la función
        }

        //recupera la lista de libros disponibles desde localStorage
        const librosDisponibles = JSON.parse(localStorage.getItem('existenciaLibros')) || [];


        //busca el libro en el array de disponibles 
        const indiceLibro = librosDisponibles.findIndex(libro => libro.titulo === titulo);

        //si libro está disponible...
        if (indiceLibro !== -1) {
            //coge el libro prestado y lo elimina de la lista de disponibles
            const libroPrestado = librosDisponibles.splice(indiceLibro, 1)[0];

            usuarioConsultado.librosPrestados.push(libroPrestado); //se añade el libro al usuario


            //actualiza el almacenamiento local con la lista de libros disponibles
            localStorage.setItem('existenciaLibros', JSON.stringify(librosDisponibles));

            //actualiza la lista de usuarios con la información actualizada del usuario consultado
            const indiceUsuario = usuariosStorage.findIndex(user =>
                normalizarTexto(user.nombreUsuario) + " " + normalizarTexto(user.apellido) === usuarioSeleccionadoNormalizado
            );

            if (indiceUsuario !== -1) {
                //actualiza los libros prestados del usuario en la lista de usuarios
                usuariosStorage[indiceUsuario].librosPrestados = usuarioConsultado.librosPrestados;
            }

            //actualiza el almacenamiento local con la lista de usuarios actualizada
            localStorage.setItem('usuarios', JSON.stringify(usuariosStorage));

            alert("Libro prestado correctamente");

        } else {
            alert("Este libro no esta disponible"); // Si no se encuentra, muestra una alerta.
        }

    }


    //agregar una entrada de blog
    agregarEntradaBlog(libro) {
        const entradas = obtenerEntradasBlog();
        //cada entrada tendrá este formato
        const nuevaEntrada = {
            titulo: `¡Nuevo libro disponible!: ${libro.titulo}`,
            contenido: `Autor: ${libro.autor}`,
            fecha: new Date().toLocaleString()
        };
        entradas.push(nuevaEntrada);
        localStorage.setItem('entradasBlog', JSON.stringify(entradas));
    }


}


  //-----------------------------//
 //   --->      MAIN     <---   //
//-----------------------------//


//instancio una biblioteca
const bibliotecaNueva = new Biblioteca();






  //-----------------------------//
 //   --->   FUNCIONES   <---   //
//-----------------------------//

// //función para crear ID único
// function generarID() {
//     return Date.now().toString();
// }

//así obtengo las entradas de blog desde Local Storage
function obtenerEntradasBlog() {
    const datos = localStorage.getItem('entradasBlog');
    return datos ? JSON.parse(datos) : [];
}

//mostrar las entradas de blog en divInicio
function mostrarEntradasBlog() {
    const divInicio = document.getElementById('verBlog');
    divInicio.innerHTML = ''; // Limpia el contenido actual

    //obtengo las entradas de blog
    const entradas = obtenerEntradasBlog();

    //creo una lista para las entradas
    const listaEntradas = document.createElement('ul');

    //se recorren las entradas de blog y crea un elemento de lista para cada una
    entradas.forEach((entrada, indice) => {
        const item = document.createElement('li');
        item.innerHTML = `
            <strong>${entrada.titulo}</strong><br>
            ${entrada.contenido}<br>
            <em>${entrada.fecha}</em>
            <br>
            <button onclick="borrarEntrada(${indice})">Borrar</button>
            <hr>
        `;
        listaEntradas.appendChild(item);
    });

    //se agrega al divInicio
    divInicio.appendChild(listaEntradas);
}

//para borrar una entrada de blog
function borrarEntrada(indice) {
    //obtiene las entradas alamacenadas
    const entradas = obtenerEntradasBlog();

    //elimina la entrada con el indice que le pasamos
    entradas.splice(indice, 1);

    //actualiza el almacenamiento local con las entradas modificadas
    localStorage.setItem('entradasBlog', JSON.stringify(entradas));

    //actualiza la visualización
    mostrarEntradasBlog();
}

//filtrar usuarios
function filtrarUsuarios() {
    const filtro = document.getElementById("buscarUsuario").value.toLowerCase();
    const selectUsuarios = document.getElementById("listaUsuarios");

    // Limpia todas las opciones anteriores
    selectUsuarios.innerHTML = "";

    // Obtiene la lista de usuarios desde el almacenamiento local
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Filtra los usuarios según el filtro y añade las opciones a la lista desplegable
    usuarios.forEach(usuario => {
        if (usuario.nombreUsuario.toLowerCase().includes(filtro)) {
            const opcion = document.createElement("option");
            opcion.value = `${usuario.nombreUsuario} ${usuario.apellido}`;
            opcion.textContent = `${usuario.nombreUsuario} ${usuario.apellido}`;
            selectUsuarios.appendChild(opcion);
        }
    });
}



//vaciar los datos almacenados
function limpiarLocalStorage() {
    //pregunta para verificar la acción
    const confirmar = confirm("¿Estás seguro de que deseas vaciar el localStorage? Esta acción no se puede deshacer.");

    //si el usuario confirma se vacia el localStorage
    if (confirmar) {
        localStorage.clear();
        alert("El localStorage ha sido vaciado.");
    } else {
        alert("La acción de vaciar el localStorage ha sido cancelada.");
    }
}

//carga los usuarios en el desplegable de prestamo
function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios;
}

//actualiza el menu desplegable con nuevos usuarios
function actualizarMenuDesplegable() {
    const listaUsuarios = document.getElementById("listaUsuarios");
    const usuarios = cargarUsuarios();

    //limpia las opciones existentes
    listaUsuarios.innerHTML = '';

    //agrega una opción por cada usuario
    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = `${usuario.nombreUsuario} ${usuario.apellido}`;
        option.text = `${usuario.nombreUsuario} ${usuario.apellido}`;
        listaUsuarios.appendChild(option);
    });
}


//funcion que me ayuda a comparar cadenas de texto
function normalizarTexto(texto) {
    // Convierte el texto a minúsculas, elimina espacios en blanco al principio y al final
    let textoNormalizado = texto.trim().toLowerCase();

    // Elimina tildes y otros caracteres diacríticos usando un regex
    textoNormalizado = textoNormalizado.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return textoNormalizado;
}



  //-----------------------------//
 //   --->   LISTENER    <---   //
//-----------------------------//

//event listener al botón agregarLibro
document.getElementById("agregarLibro").addEventListener("click", () => {
    //primero cierro la lista de libros disponibles y usuarios si están abierta
    const listaLibros = document.getElementById("librosDisponibles");
    listaLibros.innerHTML = "";

    const listaUsuarios = document.getElementById("todosUsuarios");
    listaUsuarios.innerHTML = "";


    const titulo = document.getElementById("titulo").value.trim(); // Obtiene y limpia el nombre ingresado.
    const autor = document.getElementById("autor").value.trim();

    if (titulo && autor) {
        bibliotecaNueva.agregarLibro(titulo, autor); // agrega el libro

        //bibliotecaNueva.mostrarDisponible();

        document.getElementById("titulo").value = ""; // Limpia el campo de entrada.
        document.getElementById("autor").value = "";
    } else {
        alert("Por favor, ingrese un título y autor válido."); // Muestra una alerta si el campo está vacío.
    }
});


//event listener al botón agregarLibro
document.getElementById("agregarUsuario").addEventListener("click", () => {
    //primero cierro la lista de libros disponibles y usuarios si están abierta
    const listaLibros = document.getElementById("librosDisponibles");
    listaLibros.innerHTML = "";

    const listaUsuarios = document.getElementById("todosUsuarios");
    listaUsuarios.innerHTML = "";


    const nombre = document.getElementById("nombre").value.trim(); // Obtiene y limpia el nombre ingresado.
    const apellido = document.getElementById("apellido").value.trim();

    if (nombre && apellido) {
        bibliotecaNueva.agregarUsuario(nombre, apellido); // agrega el libro

        //bibliotecaNueva.mostrarDisponible();

        document.getElementById("nombre").value = ""; // Limpia el campo de entrada.
        document.getElementById("apellido").value = "";
    } else {
        alert("Por favor, ingrese un título y autor válido."); // Muestra una alerta si el campo está vacío.
    }
});

//event listener al botón prestarLibro
document.getElementById("prestarLibro").addEventListener("click", () => {

    //obtiene y limpia el nombre ingresado.
    const titulo = document.getElementById("tituloPrestar").value.trim();

    //usa el valor seleccionado del select
    const listaUsuarios = document.getElementById("listaUsuarios");
    const usuarioSeleccionado = listaUsuarios.options[listaUsuarios.selectedIndex].value;
    const [nombreUsuario, apellido] = usuarioSeleccionado.split(' ');

    if (titulo && usuarioSeleccionado) {
        //si ambos campos están rellenos se llama a la funcion para prestar el libro
        bibliotecaNueva.prestarLibro(titulo, nombreUsuario, apellido);
        document.getElementById("tituloPrestar").value = "";
    } else {
        alert("Por favor, ingrese un título y nombre de usuario válido.");
    }
});



//event listener al botón listarLibro
document.getElementById("listarLibro").addEventListener("click", () => {
    bibliotecaNueva.listarLibrosDisponibles(); // Llama al método para listar todos los estudiantes y sus cursos.

});

//event listener al botón todosUsuarios
document.getElementById("listarUsuarios").addEventListener("click", () => {
    bibliotecaNueva.listarTodosUsuarios(); // Llama al método para listar todos los estudiantes y sus cursos.

});

// para poner una linea bajo las pestañas que no están en uso
document.addEventListener('DOMContentLoaded', function () {
    //seleccionamos todos los elementos del menú
    const menuTabs = document.querySelectorAll('div ul li');

    //añade un evento de clic a cada elemento
    menuTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            // Si el elemento ya tiene la clase 'active', sale de la función
            if (tab.classList.contains('active')) {
                return;
            }

            //elimina la clase 'active' de todos los elementos
            menuTabs.forEach(function (t) {
                t.classList.remove('active');
            });

            //solo añade la clase 'active' al elemento actual
            tab.classList.add('active');
        });
    });
});

//visibilidad de los elementos segun la opción del menú elegida
document.addEventListener('DOMContentLoaded', function () {
    // Selecciona todos los elementos de las pestañas
    const menuTabs = document.querySelectorAll('.menu li a');

    // Añade un evento de clic a cada pestaña
    menuTabs.forEach(function (tab) {
        tab.addEventListener('click', function (event) {
            event.preventDefault(); // Evita que el enlace redirija

            // Elimina la clase active de todas las pestañas y oculta todos los divs
            menuTabs.forEach(function (t) {
                t.classList.remove('active');
                const targetDiv = document.getElementById(t.dataset.target);
                // Comprueba si targetDiv es null antes de remover la clase
                if (targetDiv !== null) {
                    targetDiv.classList.remove('active');
                }
            });

            // Añade la clase active a la pestaña actual y muestra el div correspondiente
            tab.classList.add('active');
            const targetDiv = document.getElementById(tab.dataset.target);
            // Comprueba si targetDiv es null antes de agregar la clase
            if (targetDiv !== null) {
                targetDiv.classList.add('active');
            }
        });
    });
});

//llama la función mostrarEntradasBlog cuando la página se carga
window.addEventListener('DOMContentLoaded', mostrarEntradasBlog);

//llama a acutualizar lista al cargar la pagina
window.addEventListener('DOMContentLoaded', actualizarMenuDesplegable);


