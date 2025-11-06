function calcularRichardson() {
  const Ah = parseFloat(document.getElementById("ah").value);
  const Ah2 = parseFloat(document.getElementById("ah2").value);
  const p = parseFloat(document.getElementById("p").value);
  const resultadoDiv = document.getElementById("resultado");

  if (isNaN(Ah) || isNaN(Ah2) || isNaN(p)) {
    resultadoDiv.innerHTML = `<p style="color:#ff4d4d;">⚠️ Por favor, ingrese todos los valores numéricos.</p>`;
    return;
  }

  // Cálculo paso a paso
  const diff = Ah2 - Ah;
  const denom = Math.pow(2, p) - 1;
  const correction = diff / denom;
  const R = Ah2 + correction;

  // Animación y presentación paso a paso
  resultadoDiv.innerHTML = `
    <div class="paso">
      <h3>🧮 Paso 1:</h3>
      <p>Usamos la fórmula de Richardson:</p>
      <p><b>R = A(h/2) + [A(h/2) - A(h)] / (2<sup>p</sup> - 1)</b></p>
    </div>

    <div class="paso">
      <h3>🔢 Paso 2:</h3>
      <p>Sustituyendo los valores:</p>
      <p><b>R = ${Ah2} + [(${Ah2} - ${Ah})] / (2<sup>${p}</sup> - 1)</b></p>
    </div>

    <div class="paso">
      <h3>📐 Paso 3:</h3>
      <p>Calculamos cada parte:</p>
      <ul>
        <li>A(h/2) - A(h) = ${diff.toFixed(6)}</li>
        <li>(2<sup>${p}</sup> - 1) = ${denom}</li>
        <li>Corrección = ${correction.toFixed(6)}</li>
      </ul>
    </div>

    <div class="paso final">
      <h3>✅ Resultado final:</h3>
      <p><b>R = ${Ah2.toFixed(6)} + ${correction.toFixed(6)} = ${R.toFixed(6)}</b></p>
    </div>
  `;

  // Efecto de aparición suave
  resultadoDiv.style.opacity = 0;
  setTimeout(() => {
    resultadoDiv.style.transition = "opacity 0.8s ease-in-out";
    resultadoDiv.style.opacity = 1;
  }, 100);
}

