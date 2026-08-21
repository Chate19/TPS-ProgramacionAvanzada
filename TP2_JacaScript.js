/* ============================================================
   TP2 - Introducción a JavaScript
   Programación Avanzada - 2026
   ============================================================ */


/* ================= 01 - Ejercicios sobre Objetos ================= */

// 1. Creación de un Objeto Básico
const libro = {
  titulo: "Cien años de soledad",
  autor: "Gabriel García Márquez",
  añoDePublicacion: 1967
};
console.log(libro.titulo);
console.log(libro.autor);
console.log(libro.añoDePublicacion);

// 2. Anidación de Objetos
const estudiante = {
  nombre: "Agustín",
  edad: 22,
  direccion: {
    calle: "San Martín 123",
    ciudad: "Concepción del Uruguay",
    pais: "Argentina"
  }
};
console.log(
  `${estudiante.direccion.calle}, ${estudiante.direccion.ciudad}, ${estudiante.direccion.pais}`
);

// 3. Métodos en Objetos
libro.descripción = function () {
  return `${this.titulo}, escrito por ${this.autor}`;
};
console.log(libro.descripción());

// 4. Iteración sobre Propiedades de un Objeto
const producto = {
  nombre: "Notebook",
  precio: 850000,
  disponible: true
};
for (const clave in producto) {
  console.log(`${clave}: ${producto[clave]}`);
}

// 5. Actualización de Propiedades
producto.precio = 900000;
console.log(producto);

// 6. Comprobación de Propiedades
function tienePropiedad(objeto, propiedad) {
  return objeto.hasOwnProperty(propiedad);
}
console.log(tienePropiedad(producto, "precio"));
console.log(tienePropiedad(producto, "stock"));

// 7. Eliminación de Propiedades
console.log(producto);
delete producto.disponible;
console.log(producto);

// 8. Combinar Objetos
const persona1 = { nombre: "Ana", edad: 30 };
const persona2 = { ciudad: "Paraná", pais: "Argentina" };
const personaCombinada = Object.assign({}, persona1, persona2);
console.log(personaCombinada);

// 9. Copiar Objetos
const copiaEstudiante = JSON.parse(JSON.stringify(estudiante));
copiaEstudiante.nombre = "Otro nombre";
copiaEstudiante.direccion.ciudad = "Gualeguaychú";
console.log(estudiante.nombre, estudiante.direccion.ciudad);
console.log(copiaEstudiante.nombre, copiaEstudiante.direccion.ciudad);

// 10. Métodos Getters y Setters
const libroConGetterSetter = {
  titulo: "1984",
  autor: "George Orwell",
  _añoDePublicacion: 1949,
  get añoDePublicacion() {
    return this._añoDePublicacion;
  },
  set añoDePublicacion(nuevoAño) {
    this._añoDePublicacion = nuevoAño;
  }
};
libroConGetterSetter.añoDePublicacion = 1950;
console.log(libroConGetterSetter.añoDePublicacion);


/* ================= 02 - Ejercicios sobre Funciones ================= */

// 1. Función Suma
function sumar(a, b) {
  return a + b;
}
console.log(sumar(2, 3), sumar(10, -4));

// 2. Función que Multiplica
function multiplicar(a, b) {
  return a * b;
}
console.log(multiplicar(4, 5), multiplicar(-2, 6));

// 3. Función con Parámetro por Defecto
function saludar(nombre = "Invitado") {
  return `Hola, ${nombre}`;
}
console.log(saludar());
console.log(saludar("Agustín"));

// 4. Función que Devuelve un Objeto
function crearPersona(nombre, edad) {
  return { nombre, edad };
}
console.log(crearPersona("Lucía", 25));

// 5. Función que Modifica un Objeto
function actualizarEdad(persona, nuevaEdad) {
  persona.edad = nuevaEdad;
  return persona;
}
console.log(actualizarEdad(crearPersona("Juan", 20), 21));

// 6. Función Recursiva
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
console.log(factorial(5));

// 7. Función con Función Interna
function despedir() {
  function adios() {
    return "Adiós, hasta pronto";
  }
  return adios();
}
console.log(despedir());

// 8. Función que Usa Otra Función
function procesarArray(array, funcion) {
  return array.map(funcion);
}
console.log(procesarArray([1, 2, 3, 4], (n) => n * 2));

// 9. Función que Devuelve Otra Función
function crearMultiplicador(x) {
  return function (numero) {
    return numero * x;
  };
}
const multiplicarPor3 = crearMultiplicador(3);
console.log(multiplicarPor3(7));

// 10. Función Anónima
const sumarAnonima = function (a, b) {
  return a + b;
};
console.log(sumarAnonima(5, 6));


/* ================= 03 - Funciones (API, Mapeo, Autenticación) ================= */

// 1. Consumo de Datos desde una API
function obtenerUsuarios() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((respuesta) => respuesta.json())
    .then((usuarios) => {
      console.log(usuarios);
      return usuarios;
    })
    .catch((error) => console.error("Error al obtener usuarios:", error));
}

// 2. Procesamiento de Datos de una API
function imprimirNombresDeUsuarios() {
  return obtenerUsuarios().then((usuarios) => {
    const nombres = usuarios.map((usuario) => usuario.name);
    console.log(nombres);
    return nombres;
  });
}

// 3. Autenticación Simulada
function autenticarUsuario(credenciales) {
  const usuarioPredefinido = { usuario: "admin", contraseña: "1234" };
  return (
    credenciales.usuario === usuarioPredefinido.usuario &&
    credenciales.contraseña === usuarioPredefinido.contraseña
  );
}
console.log(autenticarUsuario({ usuario: "admin", contraseña: "1234" }));
console.log(autenticarUsuario({ usuario: "admin", contraseña: "mala" }));

// 4. Transformación de Datos
function mapearUsuarios(usuarios) {
  return usuarios.map(({ name, email }) => ({ nombre: name, email }));
}

// 5. Validación de Formularios
function validarFormulario({ nombre, email, password }) {
  return Boolean(nombre) && Boolean(email) && Boolean(password);
}
console.log(validarFormulario({ nombre: "Ana", email: "ana@mail.com", password: "abc123" }));
console.log(validarFormulario({ nombre: "", email: "ana@mail.com", password: "abc123" }));

// 6. Paginación de Datos
function obtenerPagina(datos, numeroPagina, elementosPorPagina = 5) {
  const inicio = (numeroPagina - 1) * elementosPorPagina;
  return datos.slice(inicio, inicio + elementosPorPagina);
}
console.log(obtenerPagina([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2));

// 7. Envío de Datos a una API
function enviarDatos(data) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      console.log(resultado);
      return resultado;
    })
    .catch((error) => console.error("Error al enviar datos:", error));
}

// 8. Búsqueda de Usuarios
function buscarUsuarioPorEmail(usuarios, email) {
  return usuarios.find((usuario) => usuario.email === email);
}

// 9. Generación de Token de Autenticación
function generarToken(usuario) {
  return btoa(JSON.stringify(usuario));
}
console.log(generarToken({ id: 1, usuario: "admin" }));

// 10. Actualización de Información del Usuario
function actualizarUsuario(usuario, cambios) {
  return { ...usuario, ...cambios };
}
console.log(actualizarUsuario({ id: 1, nombre: "Ana", edad: 30 }, { edad: 31 }));


/* ================= 04 - Operaciones con Arrays ================= */

// 1. Agregar y Eliminar Elementos
const frutas = ["manzana", "banana", "pera"];
frutas.push("kiwi");
console.log(frutas);
frutas.pop();
console.log(frutas);

// 2. Array Bidimensional
const matriz = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
console.log(matriz[1][1]);

// 3. Iterar sobre un Array
for (let i = 0; i < frutas.length; i++) {
  console.log(frutas[i]);
}

// 4. Uso de map
function elevarAlCuadrado(numeros) {
  return numeros.map((n) => n * n);
}
console.log(elevarAlCuadrado([1, 2, 3, 4]));

// 5. Uso de filter
function filtrarMayoresDe(numeros, valorReferencia) {
  return numeros.filter((n) => n > valorReferencia);
}
console.log(filtrarMayoresDe([3, 8, 15, 2, 9], 5));

// 6. Uso de reduce
function sumarElementos(numeros) {
  return numeros.reduce((acumulador, actual) => acumulador + actual, 0);
}
console.log(sumarElementos([1, 2, 3, 4, 5]));

// 7. Uso de some
const numeros = [3, 7, 12, 5];
console.log(numeros.some((n) => n > 10));

// 8. Uso de every
console.log(numeros.every((n) => n > 0));

// 9. Uso de find
const personas = [
  { nombre: "Ana", edad: 28 },
  { nombre: "Luis", edad: 35 },
  { nombre: "Marta", edad: 41 }
];
console.log(personas.find((p) => p.edad > 30));

// 10. Uso de sort
const palabras = ["banana", "kiwi", "manzana", "arándano"];
palabras.sort();
console.log(palabras);