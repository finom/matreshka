// The page's behavior, written with Matreshka itself: the view mode, Advanced mode, the theme, the menu filter, and old
// `#!` links. It runs after the bundle (/matreshka.min.js) has defined the global `Matreshka`.
(() => {
  const { bindNode, calc, on, binders } = Matreshka;
  const root = document.documentElement;
  const data = JSON.parse(document.getElementById('mk-data').textContent);
  const sections = Array.from(document.querySelectorAll('.mk-section'));
  const menuLinks = Array.from(document.querySelectorAll('.mk-nav li a[href^="#"]'));
  const search = document.getElementById('mk-search');
  // the class bindings write at once: a link to a hidden section shows it before the page scrolls to it
  const now = { debounceSetValue: false };

  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {}
    }
  };

  const state = {
    mode: root.classList.contains('mk-one') ? 'one' : 'all',
    advanced: root.classList.contains('mk-advanced'),
    dark: root.classList.contains('dark'),
    navOpen: false,
    query: '',
    current: ''
  };

  // view mode: everything, or the open section only
  calc(state, 'one', 'mode', (mode) => mode === 'one', { debounceCalc: false });
  bindNode(state, 'one', root, binders.className('mk-one'), now);
  for (const button of document.querySelectorAll('.mk-mode button')) {
    bindNode(
      state,
      'mode',
      button,
      binders.attr('aria-pressed', (mode) => String(mode === button.dataset.mode)),
      now
    );
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
    });
  }
  on(state, 'change:mode', () => store.set('mk-mode', state.mode));
  on(state, 'change:one', () => document.getElementById(state.current).scrollIntoView());

  // Advanced mode shows the third level of the API
  bindNode(state, 'advanced', '#mk-advanced');
  bindNode(state, 'advanced', root, binders.className('mk-advanced'), now);
  on(state, 'change:advanced', () => {
    store.set('mk-advanced', state.advanced ? '1' : '0');
    renderPager();
  });

  // the theme: the system's until the button picks one
  bindNode(state, 'dark', root, binders.className('dark'), now);
  document.getElementById('mk-theme').addEventListener('click', () => {
    state.dark = !state.dark;
    store.set('mk-theme', state.dark ? 'dark' : 'light');
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!store.get('mk-theme')) state.dark = event.matches;
  });

  // the menu as a drawer on small screens
  bindNode(state, 'navOpen', root, binders.className('mk-nav-open'), now);
  bindNode(state, 'navOpen', '#mk-menu', binders.attr('aria-expanded', String), now);
  document.getElementById('mk-menu').addEventListener('click', () => {
    state.navOpen = !state.navOpen;
  });
  document.getElementById('mk-backdrop').addEventListener('click', () => {
    state.navOpen = false;
  });

  // the menu filter; a search shows advanced members too, and opening one turns Advanced mode on
  bindNode(state, 'query', search);
  bindNode(state, 'query', '.mk-nav', binders.className('mk-searching', true), now);
  on(state, 'change:query', () => {
    const words = state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    for (const link of menuLinks) {
      const text = link.textContent.toLowerCase();
      link.parentElement.hidden = !words.every((word) => text.includes(word));
    }
    for (const group of document.querySelectorAll('.mk-nav details, .mk-nav ul')) {
      group.hidden = !group.querySelector('li:not([hidden])');
    }
  });
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') state.query = '';
    if (event.key !== 'Enter') return;
    const first = menuLinks.find((link) => !link.parentElement.hidden);
    if (first) {
      location.hash = first.getAttribute('href');
      search.blur();
    }
  });
  document.addEventListener('keydown', (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '');
    if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      state.navOpen = true;
      search.focus();
    }
  });

  // the open section: marked in the menu, the only one shown in One by one mode
  on(state, 'change:current', () => {
    for (const section of sections) section.classList.toggle('mk-current', section.id === state.current);
    for (const link of menuLinks) {
      if (link.getAttribute('href') === `#${state.current}`) {
        link.setAttribute('aria-current', 'true');
        // keep it in the menu's view without scrolling the page
        const nav = document.getElementById('mk-nav');
        const top = link.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop;
        if (top < nav.scrollTop || top > nav.scrollTop + nav.clientHeight - 40)
          nav.scrollTop = top - nav.clientHeight / 3;
      } else link.removeAttribute('aria-current');
    }
    renderPager();
  });

  // previous and next among the sections the reader can see
  function renderPager() {
    const pager = document.getElementById('mk-pager');
    const visible = sections.filter((section) => state.advanced || section.dataset.importance !== '3');
    const index = visible.findIndex((section) => section.id === state.current);
    pager.replaceChildren(
      ...[
        [visible[index - 1], data.previous, 'mk-previous'],
        [visible[index + 1], data.next, 'mk-next']
      ].map(([section, label, className]) => {
        if (!section) return document.createElement('span');
        const link = document.createElement('a');
        const small = document.createElement('small');
        link.href = `#${section.id}`;
        link.className = className;
        small.textContent = label;
        const title = document.querySelector(`.mk-nav a[href="#${CSS.escape(section.id)}"] span:last-child`);
        link.append(small, title?.textContent ?? section.id);
        return link;
      })
    );
  }

  // `#!Matreshka-calc` and other anchors of the old site, then the section a hash points into
  function open(scroll) {
    const raw = location.hash.slice(1);
    let id = raw;
    try {
      id = decodeURIComponent(raw);
    } catch {}
    const old = id.startsWith('!') ? id.slice(1) : null;
    if (old !== null || (id && !document.getElementById(id) && data.old[id])) {
      const key = old ?? id;
      id = data.old[key] ?? data.old[key.replace('#', '-')] ?? 'home';
      history.replaceState(null, '', `#${id}`);
    }
    const target = (id && document.getElementById(id)) || document.getElementById('home');
    const section = target.closest('.mk-section') ?? document.getElementById('home');
    if (section.dataset.importance === '3') state.advanced = true;
    state.current = section.id;
    state.navOpen = false;
    if (scroll) (state.one && target === section ? root : target).scrollIntoView();
  }
  window.addEventListener('hashchange', () => open(true));
  open(Boolean(location.hash));

  // in Everything mode the menu follows the reading position
  let frame = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (state.one || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // the last section whose top has passed the header
        const passed = sections.filter((section) => section.offsetHeight && section.getBoundingClientRect().top <= 96);
        state.current = (passed.at(-1) ?? sections[0]).id;
      });
    },
    { passive: true }
  );

  // copy buttons on code blocks
  for (const button of document.querySelectorAll('.mk-copy')) button.setAttribute('aria-label', data.copy);
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.mk-copy');
    if (!button) return;
    try {
      await navigator.clipboard.writeText(button.parentElement.querySelector('pre').textContent);
      button.classList.add('mk-copied');
      button.setAttribute('aria-label', data.copied);
      setTimeout(() => {
        button.classList.remove('mk-copied');
        button.setAttribute('aria-label', data.copy);
      }, 1500);
    } catch {}
  });

  // the home page's sample, run as written below it
  const input = document.querySelector('.mk-demo .in');
  if (input) {
    const app = {};
    const text = input.value;
    bindNode(app, 'x', '.mk-demo .in, .mk-demo .out');
    app.x = text;
  }
})();
