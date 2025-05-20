document.getElementById("addEvent").addEventListener("click", () => {
  const container = document.getElementById("eventInputs")
  const newRow = document.createElement("div")
  newRow.className = "event-row"
  newRow.innerHTML = `
  <input type="text" placeholder="Nombre del suceso" required />
  <input type="number" placeholder="Probabilidad (0-1)" step="0.01" required />
  <button type="button" class="deleteEvent">❌</button>
`
  newRow.querySelector(".deleteEvent").addEventListener("click", () => { newRow.remove();});
  container.appendChild(newRow)
})

document.getElementById("probForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const simTitle = document.getElementById("simTitle").value.trim()
  const rows = document.querySelectorAll(".event-row")
  const events = []
  let totalProb = 0

  rows.forEach((row) => {
    const [nameInput, probInput] = row.querySelectorAll("input")
    const name = nameInput.value.trim()
    const prob = parseFloat(probInput.value)

    if (!name || isNaN(prob) || prob <= 0) return

    totalProb += prob
    events.push({ name, prob })
  })

  const resultDiv = document.getElementById("result")
  resultDiv.style.display = "none"

  if (Math.abs(totalProb - 1) > 0.001) {
    resultDiv.style.display = "block"
    resultDiv.innerHTML = `❌ La suma de las probabilidades debe ser exactamente 1. (Actual: ${totalProb.toFixed(
      2
    )})`
    return
  }

  // Construcción de rangos
  let cumulative = 0
  const ranges = events.map((event) => {
    const from = cumulative
    cumulative += event.prob
    return { ...event, from, to: cumulative }
  })

  const random = Math.random() // en (0,1)
  const matched = ranges.find((r) => random > r.from && random <= r.to)

  resultDiv.style.display = "block"
  resultDiv.innerHTML = `
    <strong>${simTitle || "Simulación sin título"}</strong><br><br>
    🎲 Número aleatorio generado: <strong>${random.toFixed(4)}</strong><br>
    ✅ Resultado: <strong>${
      matched ? matched.name : "Ningún suceso fue seleccionado"
    }</strong>
  `
})
