import Matreshka from 'matreshka';

const { calc, on, onDebounce, trigger, set } = Matreshka;

function handleHashChange(router) {
  set(router, 'hashPath', window.location.hash, {
    hashEvent: true
  });
}

// a malformed escape (a lone %) stays as it is
function decode(part) {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

// '/a//b/' → ['a', 'b']
function splitPath(path) {
  const trimmed = path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

  return trimmed ? trimmed.split('/') : [];
}

function handlePopStateChange(router) {
  set(router, 'path', window.location.pathname, {
    popEvent: true
  });
}

class Router {
  parts = [];

  path = '/';

  hashPath = '#!/';

  constructor(type) {
    // the history and hash routers are singletons
    if (Object.hasOwn(Router, type) && Router[type] instanceof Router) {
      // biome-ignore lint/correctness/noConstructorReturn: new Router('hash') gives Router.hash
      return Router[type];
    }

    this.type = type;
  }

  init() {
    if (this.initialized) {
      return this;
    }

    const { type } = this;

    calc(
      this,
      {
        parts: {
          source: 'path',
          handler(path) {
            return splitPath(path).map(decode);
          }
        },
        path: {
          source: 'parts',
          handler(parts) {
            const nonEmptyParts = [];

            for (let i = 0; i < parts.length; i++) {
              if (parts[i]) {
                nonEmptyParts.push(encodeURIComponent(parts[i]));
              } else {
                break;
              }
            }

            return nonEmptyParts.length ? `/${nonEmptyParts.join('/')}/` : '/';
          }
        }
      },
      { debounceCalc: false }
    );

    calc(
      this,
      {
        hashPath: {
          source: 'path',
          handler(path) {
            return path && path !== '/' ? `#!${path}` : '';
          }
        },
        path: {
          source: 'hashPath',
          handler(hashPath) {
            // a plain anchor such as #top is not a route
            return hashPath?.startsWith('#!') ? hashPath.slice(2) : '';
          }
        }
      },
      { debounceCalc: false }
    );

    on(this, 'change:parts', (evt) => {
      const { value, previousValue } = evt;
      let equals = value.length === previousValue.length;

      if (equals) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] !== previousValue[i]) {
            equals = false;
            break;
          }
        }
      }

      if (!equals) {
        trigger(this, 'pathchange');
      }
    });

    if (typeof window !== 'undefined') {
      const { history, location } = window;

      if (type === 'hash') {
        handleHashChange(this);

        window.addEventListener('hashchange', () => handleHashChange(this));

        onDebounce(this, 'change:hashPath', (evt) => {
          if (!evt?.hashEvent) {
            location.hash = this.hashPath;
          }
        });
      } else if (type === 'history') {
        // the pathname the router last read or wrote
        let { pathname } = location;

        handlePopStateChange(this);

        // any entry counts, the first page load included; a hash change keeps the pathname and is skipped
        window.addEventListener('popstate', () => {
          if (location.pathname !== pathname) {
            ({ pathname } = location);
            handlePopStateChange(this);
          }
        });

        onDebounce(this, 'change:path', (evt) => {
          if (!evt?.popEvent) {
            history.pushState(null, '', this.path + location.search + location.hash);
            ({ pathname } = location);
          }
        });
      }
    }

    this.initialized = true;

    return this;
  }

  subscribe(obj, route) {
    const keys = splitPath(route);
    const changeEvents = [];
    const filteredKeys = keys.filter((key) => key !== '*');
    const parts = [];

    this.init();

    for (let i = 0; i < filteredKeys.length; i++) {
      const key = filteredKeys[i];
      changeEvents.push(`change:${key}`);
    }

    on(obj, changeEvents, (evt) => {
      if (evt?.routeSilent) {
        return;
      }

      const values = [];

      for (let i = 0; i < keys.length; i++) {
        const value = keys[i] === '*' ? this.parts[i] : obj[keys[i]];

        if (value) {
          values.push(value);
        } else {
          break;
        }
      }

      this.parts = values;
    });

    for (let i = 0; i < keys.length; i++) {
      const value = keys[i] === '*' ? this.parts[i] : obj[keys[i]] || this.parts[i];

      if (!value) {
        break;
      }

      parts.push(value);
    }

    // the parts after this route stay in the URL
    if (parts.length === keys.length) {
      parts.push(...this.parts.slice(keys.length));
    }

    for (let i = 0; i < keys.length; i++) {
      if (!obj[keys[i]] && this.parts[i] && keys[i] !== '*') {
        set(obj, keys[i], this.parts[i], {
          routeSilent: true
        });
      }
    }

    on(this, 'pathchange', () => {
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== '*') {
          set(obj, keys[i], this.parts[i] || null, {
            routeSilent: true
          });
        }
      }
    });

    this.parts = parts;

    return this;
  }
}

Router.history = new Router('history');
Router.hash = new Router('hash');

export default Router;
