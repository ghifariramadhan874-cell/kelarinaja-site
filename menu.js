/* Hamburger menu mobile — toggle nav drawer */
(function () {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  // Buat overlay
  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    navLinks.classList.add('open');
    toggle.classList.add('active');
    overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    navLinks.classList.remove('open');
    toggle.classList.remove('active');
    overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    if (navLinks.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Tutup pas link diklik
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Tutup kalau resize ke desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });

  // Tutup pakai Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();
