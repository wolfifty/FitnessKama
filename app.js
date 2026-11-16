const tg = window.Telegram?.WebApp;

function show(id){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  window.scrollTo(0, 0);
}

document.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]')?.dataset.go;
  if (go) show(go);
  if (e.target.closest('[data-back]')) show('home');
});

if (tg) {
  tg.ready();
  tg.expand();
}
