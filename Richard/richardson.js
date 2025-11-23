/* ==================================================
   FUNCIONES AUXILIARES
   Estas funciones ayudan a formatear números,
   evaluar expresiones y mostrar resultados.
================================================== */

/**
 * Trunca un número a 9 decimales SIN redondear.
 * Ejemplo: 1.23456789123 → 1.234567891
 */
function trunc9(num) {
  const factor = 1e9; // 10^9
  return Math.trunc(num * factor) / factor;
}

/**
 * Devuelve un número como texto siempre con 9 decimales.
 * No redondea, solo muestra el truncado con ceros rellenos.
 */
function format9(num) {
  return trunc9(num).toFixed(9);
}

/**
 * Muestra los resultados en pantalla con una pequeña animación.
 * También gestiona mensajes de error.
 */
function mostrarResultado(html, isError = false) {
  const resultadoDiv = document.getElementById("resultado");

  resultadoDiv.innerHTML = html;
  resultadoDiv.style.display = "block";
  resultadoDiv.style.opacity = 0;

  setTimeout(() => {
    resultadoDiv.style.transition = "opacity 0.8s ease-in-out";
    resultadoDiv.style.opacity = 1;
  }, 50);

  // Si es error, aplicamos estilo rojo
  if (isError) resultadoDiv.classList.add("error");
  else resultadoDiv.classList.remove("error");
}

/**
 * Evalúa expresiones matemáticas escritas por el usuario.
 * Permite ingresar cosas como:  Math.PI/4 , 2*3 , 0.5 , etc.
 */
function evalMath(str) {
  if (!str || !str.trim()) return NaN;
  try {
    return new Function("return " + str)();
  } catch (e) {
    return NaN;
  }
}

/* ==================================================
   FUNCIÓN PRINCIPAL:
   Extrapolación de Richardson
   Calcula la derivada combinando dos aproximaciones:
   D(h1) y D(h2 = h1/2)
================================================== */

function calcularRichardson() {
  // Capturamos valores del HTML
  const funcionStr = document.getElementById("funcion-display").value;
  const xStr       = document.getElementById("punto-x").value;
  const h1Str      = document.getElementById("paso-h").value;

  /* ------------------------------
     VALIDACIONES DE ENTRADA
  ------------------------------ */

  if (!funcionStr.trim())
    return mostrarResultado("<strong>Error:</strong> Por favor, construya una función f(x).", true);

  if (!xStr.trim())
    return mostrarResultado("<strong>Error:</strong> Por favor, ingrese el valor de x.", true);

  if (!h1Str.trim())
    return mostrarResultado("<strong>Error:</strong> Por favor, ingrese el tamaño de paso h.", true);

  // Evaluamos valores matemáticos
  const x  = evalMath(xStr);
  const h1 = evalMath(h1Str);
  const h2 = h1 / 2; // h2 es la mitad de h1

  if (isNaN(x) || isNaN(h1) || h1 === 0)
    return mostrarResultado("<strong>Error:</strong> Valores de x o h no válidos (h no puede ser 0).", true);

  /* ------------------------------
     Construimos la función f(x)
  ------------------------------ */
  let f;
  try {
    // Creamos una función dinámica usando el texto del usuario
    f = new Function("x", `return ${funcionStr}`);
  } catch (e) {
    return mostrarResultado(
      `<strong>Error en f(x):</strong><br>${e.message}. Revise la función.`,
      true
    );
  }

  /* ------------------------------
     CÁLCULOS PRINCIPALES
     Paso 1: D(h1)
     Paso 2: D(h2)
     Paso 3: Extrapolación
  ------------------------------ */

  try {
    // --- Paso 1: Aproximación usando h1 ---
    const D_h1_raw = (f(x + h1) - f(x - h1)) / (2 * h1);
    const D_h1 = trunc9(D_h1_raw);

    // --- Paso 2: Aproximación usando h2 ---
    const D_h2_raw = (f(x + h2) - f(x - h2)) / (2 * h2);
    const D_h2 = trunc9(D_h2_raw);

    // --- Paso 3: Fórmula de Richardson ---
    const D_mej_raw  = (4/3) * D_h2_raw - (1/3) * D_h1_raw;
    const D_mejorado = trunc9(D_mej_raw);

    /* ------------------------------
       MOSTRAR RESULTADOS (nuevo diseño)
    ------------------------------ */
    mostrarResultado(`
      <h3 style="margin-top:0;">Resultados de Richardson</h3>

      <div class="resultado-simple">
        <p><b>x:</b> ${format9(x)}</p>

        <p>
          <b>h₁:</b> ${format9(h1)}
          &nbsp; | &nbsp;
          <b>D(h₁):</b> ${format9(D_h1)}
        </p>

        <p>
          <b>h₂:</b> ${format9(h2)}
          &nbsp; | &nbsp;
          <b>D(h₂):</b> ${format9(D_h2)}
        </p>

        <hr>

        <p><b>Fórmula usada:</b> D ≈ (4/3)·D(h₂) − (1/3)·D(h₁)</p>

        <p style="font-size:16px;margin-top:10px;">
          <b>Derivada extrapolada:</b> ${format9(D_mejorado)}
        </p>
      </div>
    `);

  } catch (error) {
    mostrarResultado(
      `<strong>Error de cálculo:</strong><br>${error.message}.`,
      true
    );
  }
}

/* ==================================================
   BOTONERA Y SISTEMA DE FOCUS
   Esta sección permite escribir la función f(x)
   usando los botones del teclado matemático.
================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const keypad       = document.getElementById("keypad");
  const resultadoDiv = document.getElementById("resultado");

  // Inputs que pueden recibir escritura de la botonera
  const inputFields = [
    document.getElementById("funcion-display"),
    document.getElementById("punto-x"),
    document.getElementById("paso-h")
  ];

  // Por defecto escribimos en la función
  let currentInput = inputFields[0];

  /** Oculta resultados al cambiar de campo */
  function ocultarResultado() {
    resultadoDiv.style.display = "none";
    resultadoDiv.classList.remove("error");
  }

  // Cambiar el campo activo cuando hace focus
  inputFields.forEach(input => {
    input.addEventListener("focus", () => {
      currentInput = input;
      ocultarResultado();
      inputFields.forEach(i => i.classList.remove("active-field"));
      input.classList.add("active-field");
    });
  });

  /* ------------------------------
     LÓGICA DEL TECLADO MATEMÁTICO
  ------------------------------ */
  keypad.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    const action  = e.target.dataset.action;
    const value   = e.target.dataset.value;
    const display = currentInput;

    switch (action) {

      /* Agregar caracteres al input */
      case "append": {
        const lastChar      = display.value.slice(-1);
        const endsWithConst =
          display.value.endsWith("Math.E") || display.value.endsWith("Math.PI");

        let charToAppend = value;

        // Inserción inteligente de "*"
        if (value === "x" || value.startsWith("Math.") || value === "(") {
          if (lastChar.match(/[0-9x.)]/) || endsWithConst)
            charToAppend = ` * ${value}`;
        } else if (value.match(/[0-9]/)) {
          if (lastChar.match(/[x)]/) || endsWithConst)
            charToAppend = ` * ${value}`;
        }

        display.value += charToAppend;
        display.dispatchEvent(new Event("input"));
        break;
      }

      /* Borrar todo */
      case "clear":
        display.value = "";
        break;

      /* Borrar último caracter */
      case "backspace":
        display.value = display.value.slice(0, -1);
        break;
    }
  });
});
