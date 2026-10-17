// Sweep 4: the router and the form parser. Each test fails on the current code; the ids are the audit's.
import { parseForm } from 'src/parse-form';

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
const noDebounce = { debounceGetValue: false, debounceSetValue: false };

// a new Router module per test, so the hash singleton starts from the current URL
async function freshRouter() {
  vi.resetModules();
  const { Router } = await import('src/router');
  return Router;
}

describe('sweep 4: router', () => {
  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('RF-1: subscribing on a page opened at a plain anchor keeps the anchor and adds no history entry', async () => {
    history.replaceState(null, '', '/#section2');
    const Router = await freshRouter();
    const length = history.length;
    const obj = {};
    Router.hash.subscribe(obj, '/a/');
    await wait();

    expect(obj.a).toBe(undefined);
    expect(location.hash).toBe('#section2');
    expect(history.length).toBe(length);
  });

  it('RF-2: opening a hash route with a reserved character unescaped (#!/user@x/) adds no history entry', async () => {
    location.hash = '#!/user@x/';
    await wait();
    const Router = await freshRouter();
    const length = history.length;
    const obj = {};
    Router.hash.subscribe(obj, '/a/');
    await wait();

    expect(obj.a).toBe('user@x');
    expect(history.length).toBe(length);
  });

  it('RF-2: opening a hash route with lowercase escapes (#!/caf%c3%a9/) adds no history entry', async () => {
    location.hash = '#!/caf%c3%a9/';
    await wait();
    const Router = await freshRouter();
    const length = history.length;
    const obj = {};
    Router.hash.subscribe(obj, '/a/');
    await wait();

    expect(obj.a).toBe('café');
    expect(history.length).toBe(length);
  });
});

describe('sweep 4: parseForm', () => {
  it('RF-3: binds a named <progress>, one of the fields it looks for', () => {
    document.body.innerHTML = '<form id="f"><progress name="done" value="3" max="10"></progress></form>';
    const obj = {};
    const names = [];
    parseForm(obj, '#f', (name) => names.push(name), noDebounce);

    expect(names).toEqual(['done']);
    expect(obj.done).toBe(3);
  });
});
