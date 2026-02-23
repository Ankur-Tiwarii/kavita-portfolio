document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach((item, i) => {
        const show = filter === 'all' || item.dataset.category === filter;
        if (show) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(16px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, i * 40);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let currentIndex = 0;

  function getVisible() {
    return [...galleryItems].filter(i => !i.classList.contains('hidden'));
  }

  function openLightbox(index) {
    const items = getVisible();
    currentIndex = index;
    const item = items[currentIndex];
    lightboxImg.src = item.querySelector('img').src;
    lightboxCaption.textContent = item.querySelector('h3')?.textContent || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    const items = getVisible();
    currentIndex = (currentIndex + dir + items.length) % items.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = items[currentIndex].querySelector('img').src;
      lightboxCaption.textContent = items[currentIndex].querySelector('h3')?.textContent || '';
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(getVisible().indexOf(item));
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => navigate(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  const revealEls = document.querySelectorAll(
    '.about-grid, .skill-card, .gallery-item, .contact-grid, .tools-section, .section-label, .portfolio-title, .skills-title, .contact-title, .about-stats'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => observer.observe(el));

  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const subject = document.getElementById('formSubject').value || 'Portfolio Inquiry';
    const message = document.getElementById('formMessage').value;
    const body = `Hi Kavita,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=Kavipatelkp1995@gmail.com&su=${encodeURIComponent(subject)}&body=${body}`;
    window.open(gmailUrl, '_blank');

    const btn = e.target.querySelector('button');
    const orig = btn.textContent;
    btn.textContent = 'Opening Gmail...';
    btn.style.background = '#5a9a7a';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; e.target.reset(); }, 2500);
  });
});
