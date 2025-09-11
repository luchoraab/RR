
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
let deferredPrompt;
const btn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  if(btn) btn.style.display = 'inline-block';
});
if(btn){
  btn.style.display = 'none';
  btn.addEventListener('click', async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.style.display = 'none';
  });
}
