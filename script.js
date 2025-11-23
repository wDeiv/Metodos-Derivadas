/* ---------------------------------------------
   EVENTOS PARA LAS TARJETAS DEL MENÚ PRINCIPAL
   --------------------------------------------- */

// Agrega un listener al botón dentro de la tarjeta "derivadas"
document.getElementById("derivadas")
  .querySelector("button")
  .addEventListener("click", () => {

    // Muestra un mensaje indicando la opción seleccionada
    mostrarMensaje(
      "🧮 Has seleccionado: Derivadas de Datos Irregularmente Espaciados (Método de Interpolación)"
    );
  });

// Agrega un listener al botón dentro de la tarjeta "richardson"
document.getElementById("richardson")
  .querySelector("button")
  .addEventListener("click", () => {

    // Muestra un mensaje indicando la opción seleccionada
    mostrarMensaje(
      "⚙️ Has seleccionado: Extrapolación de Richardson (Método de Aceleración)"
    );
  });

/* ---------------------------------------------
   FUNCIÓN: mostrarMensaje(texto)
   Muestra un mensaje dinámico debajo del menú.
   --------------------------------------------- */
function mostrarMensaje(texto) {

  // Selecciona el contenedor donde irá el texto
  const content = document.getElementById("content");

  // Inserta el mensaje como HTML
  content.innerHTML = `<p>${texto}</p>`;

  // Estilos aplicados directamente desde JS
  content.style.color = "#1e3a8a";
  content.style.fontWeight = "500";
  content.style.marginTop = "20px";
}

/* ---------------------------------------------
   FUNCIÓN: irA(ruta)
   Redirige a otra página del proyecto.
   --------------------------------------------- */
function irA(ruta) {
  window.location.href = ruta; // Cambia de página
}
