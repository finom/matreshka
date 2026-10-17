import type { AnyObject } from '../types.js';
import calc from '../calc/index.js';
import on from '../on/index.js';
import onDebounce from '../ondebounce.js';
import set from '../set.js';
import trigger from '../trigger/index.js';

// a value that takes a place in the URL: 0 and false do, null, undefined and '' don't
const isPart = (value: unknown): boolean => value !== null && value !== undefined && value !== '';

// the router kinds: the URL hash (#!/a/b/) or the History API (/a/b/)
export type RouterType = 'hash' | 'history';

function handleHashChange(router: Router): void {
  set(router, 'hashPath', window.location.hash, {
    hashEvent: true
  });
}

// a malformed escape (a lone %) stays as it is
function decode(part: string): string {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

// '/a//b/' → ['a', 'b']
function splitPath(path: string): string[] {
  const trimmed = path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

  return trimmed ? trimmed.split('/') : [];
}

function handlePopStateChange(router: Router): void {
  set(router, 'path', window.location.pathname, {
    popEvent: true
  });
}

class Router {
  // the singletons, set below
  declare static history: Router;
  declare static hash: Router;

  parts: string[] = [];

  path = '/';

  hashPath = '#!/';

  // any other type makes a router of its own that reads no URL
  declare type: RouterType | (string & {});

  declare initialized?: boolean;

  constructor(type: RouterType | (string & {})) {
    // the history and hash routers are singletons
    const singleton = type === 'hash' ? Router.hash : type === 'history' ? Router.history : undefined;
    if (singleton) {
      // biome-ignore lint/correctness/noConstructorReturn: new Router('hash') gives Router.hash
      return singleton;
    }

    this.type = type;
  }

  init(): this {
    if (this.initialized) {
      return this;
    }

    const { type } = this;

    calc(
      this,
      {
        parts: {
          source: 'path',
          handler(path: string) {
            return splitPath(path).map(decode);
          }
        },
        path: {
          source: 'parts',
          handler(parts: string[]) {
            const nonEmptyParts: string[] = [];

            for (let i = 0; i < parts.length; i++) {
              if (isPart(parts[i])) {
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
          handler(path: string) {
            return path && path !== '/' ? `#!${path}` : '';
          }
        },
        path: {
          source: 'hashPath',
          handler(hashPath: string) {
            // a plain anchor such as #top is not a route
            return hashPath?.slice(0, 2) === '#!' ? hashPath.slice(2) : '';
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

        const route = (path: string) => splitPath(path).map(decode).join('/');
        onDebounce(this, 'change:hashPath', (evt) => {
          const isRoute = location.hash.slice(0, 2) === '#!';
          // an empty route leaves a plain anchor such as #top alone
          if (evt?.hashEvent || (!this.hashPath && !isRoute)) {
            return;
          }
          // the same route in another spelling (#!/foo for #!/foo/, %40 for @) is rewritten in place, with no history entry
          if (isRoute && route(location.hash.slice(2)) === route(this.path)) {
            history.replaceState(history.state, '', this.hashPath || `${location.pathname}${location.search}`);
          } else {
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

  subscribe(obj: AnyObject, route: string): this {
    const keys = splitPath(route);
    const changeEvents: string[] = [];
    const filteredKeys = keys.filter((key) => key !== '*');
    const parts: string[] = [];

    this.init();

    for (let i = 0; i < filteredKeys.length; i++) {
      const key = filteredKeys[i];
      changeEvents.push(`change:${key}`);
    }

    on(obj, changeEvents, (evt) => {
      if (evt?.routeSilent) {
        return;
      }

      const values: string[] = [];

      for (let i = 0; i < keys.length; i++) {
        const value = keys[i] === '*' ? this.parts[i] : obj[keys[i]];

        if (isPart(value)) {
          values.push(value);
        } else {
          break;
        }
      }

      this.parts = values;
    });

    for (let i = 0; i < keys.length; i++) {
      const value = keys[i] === '*' || !isPart(obj[keys[i]]) ? this.parts[i] : obj[keys[i]];

      if (!isPart(value)) {
        break;
      }

      parts.push(value);
    }

    // the parts after this route stay in the URL
    if (parts.length === keys.length) {
      parts.push(...this.parts.slice(keys.length));
    }

    for (let i = 0; i < keys.length; i++) {
      if (!isPart(obj[keys[i]]) && this.parts[i] && keys[i] !== '*') {
        set(obj, keys[i], this.parts[i], {
          routeSilent: true
        });
      }
    }

    on(this, 'pathchange', () => {
      for (let i = 0; i < keys.length; i++) {
        // a value the URL already shows keeps its type (0 stays a number)
        const part = this.parts[i];
        if (keys[i] !== '*' && !(isPart(obj[keys[i]]) && isPart(part) && String(obj[keys[i]]) === String(part))) {
          set(obj, keys[i], isPart(part) ? part : null, {
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
