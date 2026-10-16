// Regressions found by the 2026 sweep; the ids are the audit's.
const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

// a new Router module per test, so the hash and history singletons start from the current URL
async function freshRouter() {
  vi.resetModules();
  const { Router } = await import('src/router');
  return Router;
}

describe('Router regressions', () => {
  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('RT-R1: history: going back to an entry the router did not push updates the properties', async () => {
    history.replaceState(null, '', '/start/');
    const Router = await freshRouter();
    const obj = {};
    Router.history.subscribe(obj, '/a/');
    expect(obj.a).toBe('start');

    obj.a = 'next';
    await wait();
    expect(location.pathname).toBe('/next/');

    history.back();
    await wait();
    expect(location.pathname).toBe('/start/');
    expect(obj.a).toBe('start');
  });

  it('RT-R2: history: changing a property keeps the query string', async () => {
    history.replaceState(null, '', '/start/?q=1');
    const Router = await freshRouter();
    const obj = {};
    Router.history.subscribe(obj, '/a/');

    obj.a = 'next';
    await wait();
    expect(location.pathname).toBe('/next/');
    expect(location.search).toBe('?q=1');
  });

  it('RT-R3: hash: a value with a space or non-ASCII letters survives the hashchange round trip', async () => {
    location.hash = '';
    await wait();
    const Router = await freshRouter();
    const obj = {};
    Router.hash.subscribe(obj, '/a/');

    obj.a = 'café au lait';
    await wait();
    expect(obj.a).toBe('café au lait');
  });

  it('RT-R3: history: an encoded pathname gives decoded property values', async () => {
    history.replaceState(null, '', '/caf%C3%A9/');
    const Router = await freshRouter();
    const obj = {};
    Router.history.subscribe(obj, '/a/');
    expect(obj.a).toBe('café');
  });

  it('RT-R3: a value with a slash stays in its own part', async () => {
    const Router = await freshRouter();
    const router = new Router('custom');
    const obj = {};
    router.subscribe(obj, '/a/b/');

    obj.a = 'x/y';
    expect(router.path).toBe('/x%2Fy/');
    expect(obj.a).toBe('x/y');
    expect(obj.b).toBe(null);
  });

  it('RT-R4: a property that is null or empty on subscribe gets its value from the URL', async () => {
    const Router = await freshRouter();
    const router = new Router('custom');
    router.path = '/foo/bar/';
    const obj = { a: null, b: '' };
    router.subscribe(obj, '/a/b/');

    expect(router.path).toBe('/foo/bar/');
    expect(obj.a).toBe('foo');
    expect(obj.b).toBe('bar');
  });

  it('RT-R5: hash: a plain anchor (#top) is not read as a route', async () => {
    location.hash = '#!/foo/';
    await wait();
    const Router = await freshRouter();
    const obj = {};
    Router.hash.subscribe(obj, '/a/');
    expect(obj.a).toBe('foo');

    location.hash = '#top';
    await wait();
    expect(obj.a).toBe(null);
    expect(location.hash).toBe('#top');
  });

  it('RT-R6: router.parts holds only the parts of the path after subscribe', async () => {
    const Router = await freshRouter();
    const router = new Router('custom');
    router.path = '/foo/';
    router.subscribe({}, '/a/b/c/');

    expect(router.path).toBe('/foo/');
    expect(router.parts).toEqual(['foo']);
  });

  it('RT-R7: three slashes in a row collapse like two', async () => {
    const Router = await freshRouter();
    const router = new Router('custom');
    router.subscribe({}, '/x/');
    router.path = '/a///b/';

    expect(router.parts).toEqual(['a', 'b']);
  });

  it('RT-R8: subscribing a shorter route keeps the deeper parts of the URL', async () => {
    const Router = await freshRouter();
    const router = new Router('custom');
    router.subscribe({}, '/q/');
    router.path = '/a/b/';
    const deep = {};
    router.subscribe(deep, '/*/y/');
    router.subscribe({}, '/x/');

    expect(router.path).toBe('/a/b/');
    expect(deep.y).toBe('b');
  });
});
