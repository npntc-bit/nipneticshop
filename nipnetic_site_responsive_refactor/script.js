(function(){
  const btn = document.getElementById('logoButton');
  const logo = document.getElementById('logo');
  const chooser = document.getElementById('chooser');
  const text = document.getElementById('chooseText');
  if(!btn || !chooser || !text) return;
  function activateChooser(){
    btn.setAttribute('aria-expanded','true');
    btn.style.opacity = '0.0';
    btn.style.transform = 'scale(0.88)';
    setTimeout(() => {
      btn.style.display = 'none';
      chooser.classList.add('active');
      text.style.opacity = '1';
    }, 300);
  }
  btn.addEventListener('click', activateChooser);
  btn.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateChooser(); }
  });
})();
