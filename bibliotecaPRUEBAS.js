class Usuario {
    constructor(nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
        this.librosPrestados = [];
    }
}

class Libro {
    constructor(titulo, autor) {
        this.titulo = titulo;
        this.autor = autor;
    }
}

class Biblioteca {
    constructor() {
        this.disponible = [];
        this.usuarios = [];
    }

    // Agregar un nuevo usuario
    agregarUsuario(nombreUsuario) {
        // Busca si el usuario ya existe
        let nuevoUsuario = this.usuarios.find(user => user.nombreUsuario === nombreUsuario);
        
        // Si no se ha encontrado al usuario, lo crea
        if (!nuevoUsuario) {
            nuevoUsuario = new Usuario(nombreUsuario);
            this.usuarios.push(nuevoUsuario);
        }
        
        return nuevoUsuario;
    }

    // Listar todos los usuarios
    listarTodosUsuarios() {
        // Limpia las listas de libros y usuarios
        document.getElementById("librosDisponibles").innerHTML = "";
        const lista = document.getElementById("todosUsuarios");
        lista.innerHTML = "";
        
        // Título de la lista
        const titulo = document.createElement("h2");
        titulo.textContent = "Usuarios de biblioteca";
        lista.appendChild(titulo);
        
        // Lista de usuarios
        this.usuarios.forEach(usuario => {
            const item = document.createElement("li");
            const librosPrestados = usuario.librosPrestados.map(libro => `· ${libro.titulo}`).join("<br>");
            
            item.innerHTML = `
                <span class="marker"></span>👤 Usuario: ${usuario.nombreUsuario}<br>
                🕮 Libros prestados:<br>${librosPrestados}<br><br><br>
            `;
            lista.appendChild(item);
        });
    }

    // Listar libros disponibles
    listarLibrosDisponibles() {
        document.getElementById("todosUsuarios").innerHTML = "";
        const lista = document.getElementById("librosDisponibles");
        lista.innerHTML = "";
        
        // Título de la lista
        const titulo = document.createElement("h2");
        titulo.textContent = "Libros disponibles";
        lista.appendChild(titulo);
        
        // Lista de libros disponibles
        this.disponible.forEach(libro => {
            const item = document.createElement("li");
            item.innerHTML = `
                <span class="marker"></span>✓ Título: ${libro.titulo}<br>
                👤 Autor: ${libro.autor}<br><br><br>
            `;
            lista.appendChild(item);
        });
    }

    // Agregar un libro nuevo
    agregarLibro(titulo, autor) {
        const libroNuevo = new Libro(titulo, autor);
        this.disponible.push(libroNuevo);
        
        // Añade una entrada de blog
        this.agregarEntradaBlog(libroNuevo);

        alert("El libro se agregó correctamente");
    }

    // Prestar un libro a un usuario
    prestarLibro(titulo, nombreUsuario) {
        const usuarioConsultado = this.agregarUsuario(nombreUsuario);
        const indiceLibro = this.disponible.findIndex(libro => libro.titulo === titulo);
        
        if (indiceLibro !== -1) {
            const libroPrestado = this.disponible[indiceLibro];
            this.disponible.splice(indiceLibro, 1);
            usuarioConsultado.librosPrestados.push(libroPrestado);
            alert("Libro prestado correctamente");
        } else {
            alert("Este libro no está disponible");
        }
    }

    // Función para agregar una entrada de blog
    agregarEntradaBlog(libro) {
        const entradas = obtenerEntradasBlog();
        const nuevaEntrada = {
            titulo: `Nuevo libro disponible: ${libro.titulo}`,
            contenido: `Autor: ${libro.autor}\nFecha de registro: ${new Date().toLocaleString()}`,
            fecha: new Date().toLocaleString()
        };
        entradas.push(nuevaEntrada);
        localStorage.setItem('entradasBlog', JSON.stringify(entradas));
    }

    // Función para obtener entradas de blog desde Local Storage
    obtenerEntradasBlog() {
        const datos = localStorage.getItem('entradasBlog');
        return datos ? JSON.parse(datos) : [];
    }
}

// Instancia de la biblioteca
const bibliotecaNueva = new Biblioteca();

// Función para obtener entradas de blog desde Local Storage
function obtenerEntradasBlog() {
    const datos = localStorage.getItem('entradasBlog');
    return datos ? JSON.parse(datos) : [];
}

// Función para mostrar las entradas de blog en divInicio
function mostrarEntradasBlog() {
    const divInicio = document.getElementById('divInicio');
    divInicio.innerHTML = ''; // Limpia el contenido actual
    
    // Obtiene las entradas de blog
    const entradas = obtenerEntradasBlog();
    
    // Crea una lista para las entradas
    const listaEntradas = document.createElement('ul');
    
    // Recorre las entradas de blog y crea un elemento de lista para cada una
    entradas.forEach(entrada => {
        const item = document.createElement('li');
        item.innerHTML = `
            <strong>${entrada.titulo}</strong><br>
            ${entrada.contenido}<br>
            <em>Fecha: ${entrada.fecha}</em>
            <hr>
        `;
        listaEntradas.appendChild(item);
    });
    
    // Agrega la lista de entradas al divInicio
    divInicio.appendChild(listaEntradas);
}

// Llama a la función mostrarEntradasBlog cuando la página se carga
window.addEventListener('DOMContentLoaded', mostrarEntradasBlog);

// Funciones para manejar eventos de la interfaz
document.getElementById("agregarLibro").addEventListener("click", () => {
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    
    if (titulo && autor) {
        bibliotecaNueva.agregarLibro(titulo, autor);
        document.getElementById("titulo").value = "";
        document.getElementById("autor").value = "";
    } else {
        alert("Por favor, ingrese un título y autor válido.");
    }
});

document.getElementById("prestarLibro").addEventListener("click", () => {
    const titulo = document.getElementById("tituloPrestar").value.trim();
    const nombreUsuario = document.getElementById("nombreUsuario").value.trim();
    
    if (titulo && nombreUsuario) {
        bibliotecaNueva.prestarLibro(titulo, nombreUsuario);
        document.getElementById("tituloPrestar").value = "";
        document.getElementById("nombreUsuario").value = "";
    } else {
        alert("Por favor, ingrese un título y nombre de usuario válido.");
    }
});

document.getElementById("listarLibro").addEventListener("click", () => {
    bibliotecaNueva.listarLibrosDisponibles();
});

document.getElementById("listarUsuarios").addEventListener("click", () => {
    bibliotecaNueva.listarTodosUsuarios();
});
