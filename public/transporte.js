
async function postJSON(url, data){
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  return r.json();
}
const form = document.getElementById('traForm');
const statusEl = document.getElementById('status');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = 'Enviando…';
  const data = Object.fromEntries(new FormData(form).entries());
  try{
    const resp = await postJSON('/api/transporte', data);
    if(resp.ok){
      statusEl.textContent = '¡Listo! Te confirmamos por email/WhatsApp.';
      form.reset();
    }else{
      statusEl.textContent = 'Error: ' + (resp.error || 'no se pudo enviar');
    }
  }catch(err){
    statusEl.textContent = 'Error al enviar: ' + err.message;
  }
});
