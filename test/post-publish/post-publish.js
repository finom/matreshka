const { execSync } = require('child_process');
const { JSDOM } = require('jsdom');
const expect = require('expect.js');


execSync('rm -rf node_modules && npm i --no-package-lock', { cwd: __dirname });

global.window = new JSDOM('<!doctype html><html><body><form><input name="a"></form></body></html>', {
  url: 'http://localhost'
}).window;

global.document = global.window.document;

const Matreshka = require('matreshka');
const parseForm = require('matreshka-parse-form');
const Router = require('matreshka-router/router');
const initRouter = require('matreshka-router');

// check if matreshka itself is OK
const matreshka = new Matreshka();
matreshka.b = 3;
matreshka.calc('a', 'b', (b) => b * 2);
expect(matreshka.a).to.eql(6);

// check if matreshka-parse-form is OK
parseForm(matreshka, global.document.querySelector('form'));
expect(global.document.querySelector('input').value).to.eql('6');

// check if matreshka-router is OK
const customRouter = new Router('custom');
customRouter.subscribe(matreshka, '/a/');
expect(customRouter.path).to.eql('/6/');
expect(typeof initRouter === 'function');
