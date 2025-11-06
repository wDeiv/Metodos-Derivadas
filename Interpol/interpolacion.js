function calcularInterpolacion() {
  const datosTexto = document.getElementById("datos").value;
  const nodoTexto = document.getElementById("nodo").value;

  if (!datosTexto.trim()) return alert("Por favor, ingrese los datos.");
  if (!nodoTexto.trim()) return alert("Por favor, ingrese el nodo donde desea calcular la derivada.");

  const xNodo = parseFloat(nodoTexto);
  const puntos = datosTexto.split(";").map(p => p.trim().split(",").map(Number));
  const n = puntos.length;

  if (n < 2) return alert("Ingrese al menos dos puntos.");

  puntos.sort((a, b) => a[0] - b[0]);

  // Derivadas por intervalo
  let derivadasIntervalo = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = puntos[i + 1][0] - puntos[i][0];
    const dy = puntos[i + 1][1] - puntos[i][1];
    derivadasIntervalo.push(dy / dx);
  }

  // Derivadas en cada nodo
  let derivadasNodo = [];
  for (let i = 0; i < n; i++) {
    let derivada;
    if (i === 0) {
      derivada = (puntos[i + 1][1] - puntos[i][1]) / (puntos[i + 1][0] - puntos[i][0]);
    } else if (i === n - 1) {
      derivada = (puntos[i][1] - puntos[i - 1][1]) / (puntos[i][0] - puntos[i - 1][0]);
    } else {
      derivada = (puntos[i + 1][1] - puntos[i - 1][1]) / (puntos[i + 1][0] - puntos[i - 1][0]);
    }
    derivadasNodo.push(derivada);
  }

  const idx = puntos.findIndex(p => p[0] === xNodo);
  let derivadaNodoElegido = idx !== -1 ? derivadasNodo[idx] : "No se encontró un punto con ese valor de x.";
  const promedio = derivadasIntervalo.reduce((a, b) => a + b, 0) / derivadasIntervalo.length;

  document.getElementById("resultado").innerHTML = `
    <strong>Resultados:</strong><br><br>
    ➤ <strong>Derivadas por intervalo:</strong> [${derivadasIntervalo.map(v => v.toFixed(4)).join(", ")}]<br>
    ➤ <strong>Derivadas instantáneas en cada nodo:</strong> [${derivadasNodo.map(v => v.toFixed(4)).join(", ")}]<br>
    ➤ <strong>Promedio de derivadas:</strong> ${promedio.toFixed(4)}<br><br>
    <strong>Derivada en x = ${xNodo}:</strong> ${
      typeof derivadaNodoElegido === "number" ? derivadaNodoElegido.toFixed(4) + " m/s" : derivadaNodoElegido
    }
  `;
}


