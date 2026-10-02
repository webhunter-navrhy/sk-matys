(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // hero – slová postupne
  const h1 = $('[data-words]');
  if (h1) {
    let i = 0;
    const wrap = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(' '); return; }
          const w = document.createElement('span'); w.className = 'w';
          const s = document.createElement('span'); s.textContent = t; s.style.animationDelay = (0.25 + i++ * 0.08) + 's';
          w.append(s); frag.append(w);
        });
        n.replaceWith(frag);
      } else wrap(n);
    });
    wrap(h1);
  }

  // navigácia
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = ''; }));

  // reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('.rv, .clip').forEach(el => {
    const sib = el.parentElement ? [...el.parentElement.children].filter(c => c.classList.contains('rv')) : [];
    const idx = sib.indexOf(el); if (idx > 0) el.style.transitionDelay = Math.min(idx, 5) * 0.08 + 's';
    io.observe(el);
  });
  // bento – náhodné poradie odkrytia
  const bi = $$('.bi'), order = bi.map((_, i) => i).sort(() => Math.random() - .5);
  bi.forEach((el, i) => { el.style.transitionDelay = order[i] * 0.07 + 's'; io.observe(el); });

  // porovnanie sádra / vápno – hladidlo
  const box = $('#cmp');
  if (box) {
    const rng = $('input', box);
    const set = v => { box.style.setProperty('--x', v + '%'); rng.value = v; };
    rng.addEventListener('input', () => set(+rng.value));
    let drag = false;
    const fromX = x => { const r = box.getBoundingClientRect(); set(Math.max(0, Math.min(100, (x - r.left) / r.width * 100))); };
    box.addEventListener('pointerdown', e => { drag = true; box.classList.add('is-drag'); fromX(e.clientX); });
    addEventListener('pointermove', e => { if (drag) fromX(e.clientX); }, { passive: true });
    addEventListener('pointerup', () => { drag = false; box.classList.remove('is-drag'); });
    // jemná ukážka, že sa s tým dá hýbať
    const hint = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; hint.disconnect();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const t0 = performance.now(), d = 1800;
      const step = t => { if (drag) return; const p = Math.min(1, (t - t0) / d); set(50 + Math.sin(p * Math.PI * 2) * 18 * (1 - p)); if (p < 1) requestAnimationFrame(step); };
      setTimeout(() => requestAnimationFrame(step), 600);
    }), { threshold: .6 });
    hint.observe(box);
  }

  // lightbox
  const lb = $('#lb'), lbimg = $('#lbimg');
  $$('.bi').forEach(g => g.addEventListener('click', () => { lbimg.src = g.dataset.full; lbimg.alt = $('img', g).alt; lb.hidden = false; document.body.style.overflow = 'hidden'; }));
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  $('#lbx').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (!lb.hidden && e.key === 'Escape') close(); });

  // dopyt
  $('#dopyt').addEventListener('submit', e => { e.preventDefault(); $('#formok').hidden = false; });
})();
