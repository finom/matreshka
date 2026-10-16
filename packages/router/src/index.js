import Router from './router';

function initRouter(obj, route, type) {
  Router[type || 'hash'].subscribe(obj, route);
  return obj;
}

// a page with the Matreshka bundle gets Matreshka.Router and Matreshka.initRouter
/* istanbul ignore if */
if (typeof globalThis.Matreshka === 'function') {
  globalThis.Matreshka.Router = Router;
  globalThis.Matreshka.initRouter = initRouter;
}

export default initRouter;
