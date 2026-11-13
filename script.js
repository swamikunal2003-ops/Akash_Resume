/* ==========================================================================
   AKASH RAJ — PERSONAL WEBSITE INTERACTION ENGINE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const views = {
    home: document.getElementById('view-home'),
    menu: document.getElementById('view-menu'),
    portfolio: document.getElementById('view-portfolio'),
    about: document.getElementById('view-about'),
    contact: document.getElementById('view-contact')
  };

  const navPills = document.querySelectorAll('.nav-pill[data-target]');
  const glassMenuBtns = document.querySelectorAll('.apple-glass-btn[data-target]');
  const backBtns = document.querySelectorAll('[data-action="back-to-menu"]');

  function navigateTo(viewName, pushHash = true) {
    if (!views[viewName]) viewName = 'home';

    body.setAttribute('data-view', viewName);

    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.add('is-active');
      } else {
        views[key].classList.remove('is-active');
      }
    });

    navPills.forEach(pill => {
      const target = pill.getAttribute('data-target');
      pill.classList.toggle('active', target === viewName);
    });

    if (pushHash) {
      if (viewName === 'home') {
        history.replaceState(null, '', window.location.pathname);
      } else {
        history.replaceState(null, '', `#${viewName}`);
      }
    }
  }

  views.home.addEventListener('click', (e) => {
    if (e.target.closest('.top-glass-nav')) return;
    navigateTo('menu');
  });

  navPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = pill.getAttribute('data-target');
      navigateTo(target);
    });
  });

  glassMenuBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.getAttribute('data-target');
      navigateTo(target);
    });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--mouse-x', `${x}px`);
      btn.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  backBtns.forEach(btn => {
    btn.addEventListener('click', () => navigateTo('menu'));
  });

  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox-modal');
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('open')) {
        closeLightbox();
        return;
      }
      const current = body.getAttribute('data-view');
      if (current === 'portfolio' || current === 'about' || current === 'contact') {
        navigateTo('menu');
      } else if (current === 'menu') {
        navigateTo('home');
      }
    }
  });

  const initialHash = window.location.hash.replace('#', '').toLowerCase();
  if (initialHash && views[initialHash]) {
    navigateTo(initialHash, false);
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const portfolioGrid = document.getElementById('portfolio-grid');
  const deckGrid = document.getElementById('deck-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      if (category === 'slides') {
        portfolioGrid.classList.add('hidden');
        deckGrid.classList.add('active');
      } else {
        portfolioGrid.classList.remove('hidden');
        deckGrid.classList.remove('active');

        projectCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });

  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxTitle.textContent = title || 'Portfolio Showcase';
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  document.querySelectorAll('[data-lightbox-src]').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(
        item.getAttribute('data-lightbox-src'),
        item.getAttribute('data-lightbox-title')
      );
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(value).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = original;
        }, 1800);
      });
    });
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('sender-subject').value.trim() || 'Project Inquiry via Portfolio Website';
      const message = document.getElementById('sender-message').value.trim();

      const bodyText = `Hi Aakash,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
      window.location.href = `mailto:whereismycloud27@gmail.com?subject=${encodeURIComponent(subject)}&body=${bodyText}`;
    });
  }
});
