// The script-tag bundle: one global `Matreshka` with the router and the form parser attached.
import Matreshka from './index.js';
import type { MatreshkaConstructor } from './matreshka/index.js';
import { parseForm } from './parse-form/index.js';
import { initRouter, Router } from './router/index.js';

// the bundle's Matreshka: the class with three more statics
interface BundledMatreshkaConstructor extends MatreshkaConstructor {
  initRouter: typeof initRouter;
  Router: typeof Router;
  parseForm: typeof parseForm;
}

const BundledMatreshka = Matreshka as BundledMatreshkaConstructor;
type BundledMatreshka = Matreshka;

BundledMatreshka.initRouter = initRouter;
BundledMatreshka.Router = Router;
BundledMatreshka.parseForm = parseForm;

// the value and the instance type under one name
export { BundledMatreshka as default };
