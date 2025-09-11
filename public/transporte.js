
const form = document.getElementById('formTrans');
const statusEl = document.getElementById('status');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = 'Enviando…';
  const data = Object.fromEntries(new FormData(form).entries());
  try{
    const res = await fetch('/api/transporte',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const json = await res.json();
    statusEl.textContent = json.ok ? '¡Listo! Recibimos tu solicitud.' : (json.error || 'Error al enviar');
    if(json.ok) form.reset();
  }catch(err){
    statusEl.textContent = 'Error de red';
  }
});
