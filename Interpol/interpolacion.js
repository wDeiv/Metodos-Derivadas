/* ==================================================
   INICIALIZACIÓN AL CARGAR LA PÁGINA
================================================== */

/**
 * Cuando el documento termina de cargar:
 *  - Se configura el botón "Añadir Punto" para crear nuevas filas.
 *  - Se configura el botón "×" de cada fila para eliminarla.
 *  - Se crean 3 filas iniciales por defecto.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Botón para agregar una nueva fila de punto
  document.getElementById("agregar-punto").addEventListener("click", () => crearFila());

  // Delegación de eventos para eliminar filas al hacer clic en "×"
  tablaPuntosEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("remover-punto")) {
      e.target.parentElement.remove();
    }
  });

  // Crear 3 filas iniciales para que el usuario no empiece desde cero
  crearFila(0, '');
  crearFila(1, '');
  crearFila(2, '');
});
/* ==================================================
   VARIABLES GLOBALES
   Referencias a elementos del DOM que usaremos
================================================== */

// Contenedor donde se agregarán dinámicamente las filas (x, y)
const tablaPuntosEl = document.getElementById("tabla-puntos");

// Input donde el usuario escribe el nodo (valor de x)
const nodoInput = document.getElementById("nodo");

// Div donde se mostrarán los resultados o mensajes de error
const resultadoDiv = document.getElementById("resultado");

/* ==================================================
   FUNCIONES AUXILIARES
================================================== */

/**
 * Trunca un número a cierta cantidad de decimales SIN redondear.
 * Ejemplo: trunc(1.23456789, 3) => 1.234
 */
function trunc(num, decimals = 9) {
  const multiplier = Math.pow(10, decimals);
  return Math.trunc(num * multiplier) / multiplier;
}

/**
 * Aplica trunc y devuelve el número como string
 * con exactamente "decimals" decimales (rellena con ceros).
 */
function truncAndFormat(num, decimals = 9) {
  return trunc(num, decimals).toFixed(decimals);
}

/**
 * Muestra un mensaje HTML dentro del div de resultados.
 * Si isError es true, agrega la clase "error" para cambiar el estilo.
 */
function mostrarResultado(html, isError = false) {
  resultadoDiv.innerHTML = html;
  resultadoDiv.style.display = 'block';
  resultadoDiv.classList.toggle("error", isError);
}


/* ==================================================
   TABLA DINÁMICA DE PUNTOS (x, y)
================================================== */

/**
 * Crea una nueva fila de punto (x, y) y la agrega a la tabla.
 * Si se pasan valores por parámetro, se usan como valores iniciales.
 */
function crearFila(x = '', y = '') {
  // Contenedor de la fila
  const filaDiv = document.createElement('div');
  filaDiv.className = 'punto-fila';

  // Estructura HTML de la fila: input x, input y y botón para quitar
  filaDiv.innerHTML = `
    <input type="number" class="punto-x" placeholder="x" value="${x}">
    <input type="number" class="punto-y" placeholder="y" value="${y}">
    <button class="remover-punto" title="Eliminar fila">×</button>
  `;

  // Se añade la fila al contenedor principal
  tablaPuntosEl.appendChild(filaDiv);
}

/**
 * Lee todos los puntos (x, y) de la tabla y los devuelve en un array.
 * Valida que sean numéricos, que existan y que no se repitan las x.
 * Devuelve:
 *   - Array de puntos [[x1, y1], [x2, y2], ...] si todo está bien
 *   - null si hay errores (y ya muestra el mensaje).
 */
function getPoints() {
  // Todas las filas actuales de la tabla
  const filas = tablaPuntosEl.querySelectorAll('.punto-fila');
  let puntos = [];

  // Recorremos cada fila para leer sus valores
  for (const fila of filas) {
    const xVal = fila.querySelector(".punto-x").value;
    const yVal = fila.querySelector(".punto-y").value;

    // Si alguno de los campos tiene algo escrito, se procesa la fila
    if (xVal || yVal) {
      const x = parseFloat(xVal);
      const y = parseFloat(yVal);

      // Validación numérica
      if (isNaN(x) || isNaN(y)) {
        mostrarResultado("<strong>Error:</strong> Todos los puntos deben ser números.", true);
        return null;
      }

      puntos.push([x, y]);
    }
  }

  // Validar que al menos se haya ingresado un punto
  if (puntos.length === 0) {
    mostrarResultado("<strong>Error:</strong> No se han ingresado puntos.", true);
    return null;
  }

  // Ordenar los puntos por el valor de x de menor a mayor
  puntos.sort((a, b) => a[0] - b[0]);

  // Verificar que no haya valores de x repetidos
  for (let i = 0; i < puntos.length - 1; i++) {
    if (puntos[i][0] === puntos[i + 1][0]) {
      mostrarResultado(`<strong>Error:</strong> Valores de 'x' duplicados (${puntos[i][0]}).`, true);
      return null;
    }
  }

  // Si todo está bien, se devuelven los puntos
  return puntos;
}


/* ==================================================
   PRIMERA DERIVADA
================================================== */

/**
 * Calcula la primera derivada usando:
 *  - Diferencias por intervalo (pendientes entre puntos consecutivos)
 *  - Método de Lagrange si hay exactamente 3 puntos
 *  - Diferencias finitas (adelante, atrás, centrada) para > 3 puntos
 * Muestra:
 *  - Derivadas por intervalo
 *  - Derivadas en cada nodo
 *  - Promedio de derivadas por intervalo
 *  - Derivada en el nodo elegido por el usuario
 */
function calcularPrimeraDerivada() {
  // Obtener y validar puntos
  const puntos = getPoints();
  if (!puntos) return;

  // Leer el nodo donde se desea calcular la derivada
  const xNodoStr = nodoInput.value;
  if (!xNodoStr.trim()) {
    mostrarResultado("<strong>Error:</strong> Ingrese el nodo (x).", true);
    return;
  }

  const xNodo = parseFloat(xNodoStr);
  if (isNaN(xNodo)) {
    mostrarResultado("<strong>Error:</strong> El nodo (x) debe ser un número.", true);
    return;
  }

  const n = puntos.length;
  if (n < 2) {
    mostrarResultado("<strong>Error:</strong> Se necesitan al menos dos puntos.", true);
    return;
  }

  // Arrays donde guardaremos resultados
  let derivadasNodo = [];
  let derivadasIntervalo = [];

  // ==========================
  // Derivadas por intervalo:
  //  (y_{i+1} - y_i) / (x_{i+1} - x_i)
  // ==========================
  for (let i = 0; i < n - 1; i++) {
    const dx = puntos[i + 1][0] - puntos[i][0];
    const dy = puntos[i + 1][1] - puntos[i][1];
    derivadasIntervalo.push(trunc(dy / dx));
  }

  // ==========================
  // Derivadas en cada nodo
  // ==========================
  if (n === 3) {
    // Caso especial: exactamente 3 puntos
    // Usamos la fórmula de Lagrange para la derivada del polinomio interpolante

    const [x1, y1] = puntos[0];
    const [x2, y2] = puntos[1];
    const [x3, y3] = puntos[2];

    // Para cada nodo xi, se aplica la fórmula de f'(x)
    for (let i = 0; i < 3; i++) {
      const xi = puntos[i][0];

      const fprime =
        ((2 * xi - x2 - x3) / ((x1 - x2) * (x1 - x3)) * y1) +
        ((2 * xi - x1 - x3) / ((x2 - x1) * (x2 - x3)) * y2) +
        ((2 * xi - x1 - x2) / ((x3 - x1) * (x3 - x2)) * y3);

      derivadasNodo.push(trunc(fprime));
    }

  } else {
    // Caso general: 2, 4, 5, ... puntos
    // Usamos diferencias finitas:
    //  - Primer nodo: hacia adelante
    //  - Último nodo: hacia atrás
    //  - Nodos intermedios: centrada

    for (let i = 0; i < n; i++) {
      let derivada;

      if (i === 0) {
        // Derivada hacia adelante
        derivada =
          (puntos[i + 1][1] - puntos[i][1]) /
          (puntos[i + 1][0] - puntos[i][0]);

      } else if (i === n - 1) {
        // Derivada hacia atrás
        derivada =
          (puntos[i][1] - puntos[i - 1][1]) /
          (puntos[i][0] - puntos[i - 1][0]);

      } else {
        // Derivada centrada
        derivada =
          (puntos[i + 1][1] - puntos[i - 1][1]) /
          (puntos[i + 1][0] - puntos[i - 1][0]);
      }

      derivadasNodo.push(trunc(derivada));
    }
  }

  // Buscar el índice del nodo elegido por el usuario
  const idx = puntos.findIndex(p => p[0] === xNodo);

  // Si se encuentra, se usa su derivada; si no, se marca como null
  const derivadaNodoElegido = idx !== -1 ? derivadasNodo[idx] : null;

  // Promedio de las derivadas por intervalo
  const promedio = trunc(
    derivadasIntervalo.reduce((a, b) => a + b, 0) / derivadasIntervalo.length
  );

  // Mostrar todos los resultados en pantalla
  mostrarResultado(`
    <div class="resultado-item">
      <span class="label">Derivadas por intervalo:</span>
      <span class="value">[${derivadasIntervalo.map(v => truncAndFormat(v)).join(", ")}]</span>
    </div>
    <div class="resultado-item">
      <span class="label">Derivadas en cada nodo:</span>
      <span class="value">[${derivadasNodo.map(v => truncAndFormat(v)).join(", ")}]</span>
    </div>
    <div class="resultado-item">
      <span class="label">Promedio de derivadas:</span>
      <span class="value">${truncAndFormat(promedio)}</span>
    </div>
    <div class="resultado-final">
      <span class="label">Derivada en x = ${xNodo}:</span>
      <span class="value">
        ${derivadaNodoElegido !== null ? truncAndFormat(derivadaNodoElegido) : "Nodo no encontrado"}
      </span>
    </div>
  `);
}


/* ==================================================
   SEGUNDA DERIVADA
================================================== */

/**
 * Calcula la segunda derivada en el nodo elegido usando:
 *   f''(x) ≈ ( (y₂ - y₁)/h₂ - (y₁ - y₀)/h₁ ) / ((h₁ + h₂)/2)
 * Solo se puede calcular si el nodo NO es el primero ni el último
 * (es decir, debe tener un punto antes y otro después).
 */
function calcularSegundaDerivada() {
  // Obtener y validar puntos
  const puntos = getPoints();
  if (!puntos) return;

  // Leer el nodo donde se desea la segunda derivada
  const xNodoStr = nodoInput.value;
  if (!xNodoStr.trim()) {
    mostrarResultado("<strong>Error:</strong> Ingrese el nodo (x).", true);
    return;
  }

  const xNodo = parseFloat(xNodoStr);
  if (isNaN(xNodo)) {
    mostrarResultado("<strong>Error:</strong> El nodo (x) debe ser un número.", true);
    return;
  }

  const n = puntos.length;
  const idx = puntos.findIndex(p => p[0] === xNodo);

  // Validaciones: nodo debe existir y no ser extremo
  if (idx === -1) {
    mostrarResultado(`<strong>Error:</strong> Nodo x = ${xNodo} no encontrado.`, true);
    return;
  }
  if (idx < 1 || idx > n - 2) {
    mostrarResultado(`<strong>Error:</strong> No se puede calcular 2da derivada en x = ${xNodo}.`, true);
    return;
  }

  // Puntos vecinos: anterior, actual y siguiente
  const [x0, y0] = puntos[idx - 1];
  const [x1, y1] = puntos[idx];
  const [x2, y2] = puntos[idx + 1];

  // Distancias entre puntos
  const h1 = x1 - x0;
  const h2 = x2 - x1;

  // Diferencias de primer orden
  const term1 = (y2 - y1) / h2;
  const term2 = (y1 - y0) / h1;

  // Fórmula aproximada para la segunda derivada con mallas no uniformes
  const segundaDerivada = trunc((term1 - term2) / ((h1 + h2) / 2));

  // Mostrar resultado
  mostrarResultado(`
    <div class="resultado-final">
      <span class="label">Segunda Derivada en x = ${xNodo}:</span>
      <span class="value">${truncAndFormat(segundaDerivada)}</span>
    </div>
  `);
}
