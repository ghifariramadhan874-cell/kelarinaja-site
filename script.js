// FAQ Accordion Interaction
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        }
      });
    }
  });
}

// Smooth scroll offset adjustment for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Animated Counting Numbers (Index Page)
function initCounterAnimation() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  let animated = false;

  function runCounters() {
    statElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const format = el.getAttribute('data-format');
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const easeOutQuad = t => t * (2 - t);

      const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const current = target * progress;

        if (format === 'decimal') {
          el.textContent = current.toFixed(1) + suffix;
        } else {
          el.textContent = Math.floor(current).toLocaleString('id-ID') + suffix;
        }

        if (frame >= totalFrames) {
          clearInterval(counter);
          if (format === 'decimal') {
            el.textContent = target.toFixed(1) + suffix;
          } else {
            el.textContent = target.toLocaleString('id-ID') + suffix;
          }
        }
      }, frameDuration);
    });
  }

  function checkScroll() {
    if (animated) return;
    const statsSection = document.querySelector('.stats-counter-grid');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight * 0.9 && rect.bottom >= 0) {
      animated = true;
      runCounters();
      window.removeEventListener('scroll', checkScroll);
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

// Interactive Price Calculator (cek-estimasi.html)
function initPriceCalculator() {
  const slider = document.getElementById('sliderHalaman');
  if (!slider) return;

  const valHalaman = document.getElementById('valHalaman');
  const totalPriceEl = document.getElementById('totalPrice');
  const kategoriSelect = document.getElementById('kategoriTugas');
  const summaryPaket = document.getElementById('summaryPaket');
  const summaryLayanan = document.getElementById('summaryLayanan');
  const summaryVolume = document.getElementById('summaryVolume');
  const summaryDeadline = document.getElementById('summaryDeadline');
  const btnOrderCalc = document.getElementById('btnOrderCalc');

  function calculate() {
    const pages = parseInt(slider.value, 10);
    valHalaman.textContent = pages + ' Halaman';

    const jenjangRadio = document.querySelector('input[name="jenjang"]:checked');
    const jenjang = jenjangRadio ? jenjangRadio.value : 'sekolah';

    const deadlineRadio = document.querySelector('input[name="deadline"]:checked');
    const deadline = deadlineRadio ? deadlineRadio.value : 'santai';

    const kategori = kategoriSelect.value;
    const kategoriName = kategoriSelect.options[kategoriSelect.selectedIndex].text;

    // Base rates per page
    let basePerPage = 7000; // sekolah default
    let paketLabel = "SMP / SMA";

    if (jenjang === 'kuliah') {
      basePerPage = 12000;
      paketLabel = "Mahasiswa (D3/S1)";
    }

    // Multiplier kategori
    let catMultiplier = 1.0;
    if (kategori === 'paper') catMultiplier = 1.3;
    if (kategori === 'ppt') catMultiplier = 1.1;
    if (kategori === 'coding') catMultiplier = 1.8;
    if (kategori === 'olahdata') catMultiplier = 2.0;
    if (kategori === 'skripsi') catMultiplier = 1.5;

    // Multiplier deadline
    let speedMultiplier = 1.0;
    let deadlineLabel = "3 - 5 Hari Kerja (Santai)";
    if (deadline === 'reguler') {
      speedMultiplier = 1.25;
      deadlineLabel = "1 - 2 Hari Kerja (Reguler)";
    } else if (deadline === 'express') {
      speedMultiplier = 1.6;
      deadlineLabel = "Express (3 - 12 Jam)";
    }

    // Minimum base per order
    let calculated = Math.round((pages * basePerPage * catMultiplier * speedMultiplier) / 1000) * 1000;
    let minPrice = jenjang === 'sekolah' ? 15000 : 35000;
    if (calculated < minPrice) calculated = minPrice;

    totalPriceEl.textContent = calculated.toLocaleString('id-ID');
    summaryPaket.textContent = paketLabel;
    summaryLayanan.textContent = kategoriName;
    summaryVolume.textContent = pages + ' Halaman';
    summaryDeadline.textContent = deadlineLabel;

    // Update WhatsApp link with pre-filled message
    const waText = encodeURIComponent(
      `Halo Admin KelarinAja, saya mau pesan tugas dengan rincian berikut:\n` +
      `- Paket: ${paketLabel}\n` +
      `- Kategori: ${kategoriName}\n` +
      `- Jumlah: ${pages} Halaman\n` +
      `- Deadline: ${deadlineLabel}\n` +
      `- Estimasi Biaya: Rp ${calculated.toLocaleString('id-ID')}\n\n` +
      `Bisa dibantu proses ya min?`
    );
    btnOrderCalc.href = `https://wa.me/6285770626647?text=${waText}`;
  }

  slider.addEventListener('input', calculate);
  kategoriSelect.addEventListener('change', calculate);
  document.querySelectorAll('input[name="jenjang"]').forEach(r => r.addEventListener('change', calculate));
  document.querySelectorAll('input[name="deadline"]').forEach(r => r.addEventListener('change', calculate));

  calculate();
}

// Run All on Load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initSmoothScroll();
    initCounterAnimation();
    initPriceCalculator();
  });
} else {
  initFAQ();
  initSmoothScroll();
  initCounterAnimation();
  initPriceCalculator();
}

/* Floating WA: sembunyikan di atas (hero), muncul setelah scroll biar gak nutup konten */
(function () {
  var wa = document.querySelector('.floating-wa');
  if (!wa) return;
  function upd() {
    var y = window.scrollY || document.documentElement.scrollTop;
    wa.classList.toggle('wa-shown', y > 300);
  }
  window.addEventListener('scroll', upd, { passive: true });
  upd();
})();
