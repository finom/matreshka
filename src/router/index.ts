import Router, { type RouterType } from './router.js';

// binds the keys of a route ("a/b/*/c") to the parts of the URL
function initRouter<T extends object>(obj: T, route: string, type?: RouterType): T {
  Router[type || 'hash'].subscribe(obj, route);
  return obj;
}

export { initRouter, Router };
export type { RouterType };
