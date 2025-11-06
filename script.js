document.getElementById("derivadas").querySelector("button").addEventListener("click", () => {
  mostrarMensaje("🧮 Has seleccionado: Derivadas de Datos Irregularmente Espaciados (Método de Interpolación)");
});

document.getElementById("richardson").querySelector("button").addEventListener("click", () => {
  mostrarMensaje("⚙️ Has seleccionado: Extrapolación de Richardson (Método de Aceleración)");
});

function mostrarMensaje(texto) {
  const content = document.getElementById("content");
  content.innerHTML = `<p>${texto}</p>`;
  content.style.color = "#1e3a8a";
  content.style.fontWeight = "500";
  content.style.marginTop = "20px";
}

function irA(ruta) {
  window.location.href = ruta;
}
