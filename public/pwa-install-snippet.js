
let deferredPrompt;
const btn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  if(btn){ btn.disabled = false; }
});
if(btn){
  btn.addEventListener('click', async ()=>{
    if(!deferredPrompt) { alert('Si tu navegador lo permite, aparecerá la opción de instalar.'); return; }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
}
