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

// the parts up to the first empty one, as a path: ['a', 'b'] → '/a/b/'
function toPath(parts: string[]): string {
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

// the same route in any spelling: '/a' and '/a/', '%40' and '@'
const route = (path: string) => splitPath(path).map(decode).join('/');

// the hash and history singletons, made and initialized on first use
const singletons: { hash?: Router; history?: Router } = {};

function handlePopStateChange(router: Router): void {
  set(router, 'path', window.location.pathname, {
    popEvent: true
  });
}

class Router {
  // the singletons, defined below
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
    const kind = type === 'hash' || type === 'history' ? (type as RouterType) : undefined;
    const singleton = kind && singletons[kind];
    if (singleton) {
      // biome-ignore lint/correctness/noConstructorReturn: new Router('hash') gives Router.hash
      return singleton;
    }

    this.type = type;

    if (kind) {
      singletons[kind] = this;
      // a singleton reads the URL as soon as it exists, so it can be bound like any object
      this.init();
    }
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
          handler: toPath
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

        onDebounce(this, 'change:hashPath', (evt) => {
          const isRoute = location.hash.slice(0, 2) === '#!';
          // an empty route leaves a plain anchor such as #top alone
          if (evt?.hashEvent || (!this.hashPath && !isRoute)) {
            return;
          }
          // the same route in another spelling (#!/foo for #!/foo/, %40 for @) is rewritten in place, with no history entry
          if (isRoute && route(location.hash.slice(2)) === route(this.path)) {
            history.replaceState(history.state, '', this.hashPath || `${location.pathname}${location.search}`);
          } else if (this.hashPath) {
            location.hash = this.hashPath;
          } else {
            // location.hash = '' would leave a bare '#'; pushState fires no hashchange, and the router already holds the new route
            history.pushState(history.state, '', `${location.pathname}${location.search}`);
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
          if (evt?.popEvent) {
            return;
          }
          // the route the URL already shows adds no entry; another spelling of it (/a for /a/) is rewritten in place
          if (route(location.pathname) === route(this.path)) {
            const canonical = toPath(splitPath(this.path).map(decode));
            if (location.pathname !== canonical) {
              history.replaceState(history.state, '', canonical + location.search + location.hash);
            }
          } else {
            history.pushState(null, '', this.path + location.search + location.hash);
          }
          ({ pathname } = location);
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

    // the properties after an empty part get null: the URL can't show them
    const resetAfter = (index: number) => {
      for (let i = index + 1; i < keys.length; i++) {
        if (keys[i] !== '*' && isPart(obj[keys[i]])) {
          set(obj, keys[i], null, {
            routeSilent: true
          });
        }
      }
    };

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

      // a change:key triggered by hand has no event object
      if (evt && !isPart(evt.value)) {
        resetAfter(keys.indexOf(evt.key));
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
    } else {
      resetAfter(parts.length);
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

// a page that loads the library but never uses the router gets no listener
for (const type of ['hash', 'history'] as const) {
  Object.defineProperty(Router, type, {
    configurable: true,
    enumerable: true,
    get: () => singletons[type] || new Router(type)
  });
}

// dist/ assigns class methods (Babel's setClassMethods): as in a native class, a for-in doesn't list them
const methods = Object.getOwnPropertyNames(Router.prototype);
for (let i = 0; i < methods.length; i++) {
  Object.defineProperty(Router.prototype, methods[i], { enumerable: false });
}

export default Router;
