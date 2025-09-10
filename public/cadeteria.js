const form = document.getElementById("comandaForm");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Enviando…";

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch("/api/comanda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (json.ok) {
      statusEl.textContent = "¡Listo! Te vamos a contactar para confirmar.";
      form.reset();
    } else {
      statusEl.textContent = json.error || "No se pudo enviar";
    }
  } catch {
    statusEl.textContent = "Ocurrió un error al enviar.";
  }
});
