(function () {
  const burger = document.querySelector('.menu-burger');
  const nav = document.querySelector('.heder-menu');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
      nav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }
})();

(function () {
  const section = document.querySelector('.projects');
  const lightbox = document.getElementById('projects-lightbox');

  if (!section || typeof Swiper === 'undefined') return;

  const counter = section.querySelector('.projects__counter');
  const carouselEl = section.querySelector('.projects__carousel');
  const lightboxEl = lightbox?.querySelector('.projects-lightbox__swiper');
  const cards = [...section.querySelectorAll('.projects__card')];
  const total = cards.length;

  if (!carouselEl || !total) return;

  const updateCounter = (swiper) => {
    if (counter) {
      counter.textContent = `${swiper.activeIndex + 1} / ${total}`;
    }
  };

  const carousel = new Swiper(carouselEl, {
    slidesPerView: 1,
    spaceBetween: 20,
    speed: 400,
    watchOverflow: true,
    navigation: {
      nextEl: section.querySelector('.projects__btn--next'),
      prevEl: section.querySelector('.projects__btn--prev'),
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
    on: {
      init: updateCounter,
      slideChange: updateCounter,
    },
  });

  if (!lightbox || !lightboxEl) return;

  const lightboxSwiper = new Swiper(lightboxEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 300,
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    navigation: {
      nextEl: lightbox.querySelector('.projects-lightbox__next'),
      prevEl: lightbox.querySelector('.projects-lightbox__prev'),
    },
  });

  const openLightbox = (index) => {
    lightboxSwiper.slideTo(index, 0);
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxSwiper.update();
    lightbox.querySelector('.projects-lightbox__close')?.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const index = Number(card.dataset.index) || 0;
      openLightbox(index);
    });
  });

  lightbox.querySelector('.projects-lightbox__close')?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });

  window.addEventListener('resize', () => {
    carousel.update();
    lightboxSwiper.update();
  });
})();
