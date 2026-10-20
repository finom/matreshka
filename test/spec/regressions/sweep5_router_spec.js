// Sweep 5: the router. Each test with an id fails on the code before the fix (ES5-7 on dist/: npm run test:dist);
// the ids are the audit's.
import { bindNode, binders, trigger } from 'src';

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

// a new Router module per test, so the singletons start from the current URL
async function freshRouter() {
  vi.resetModules();
  const { Router } = await import('src/router');
  return Router;
}

const forInKeys = (object) => {
  const keys = [];
  for (const key in object) keys.push(key);
  return keys;
};

describe('sweep 5: router', () => {
  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('RT-1: a property changed and changed back before the write adds no history entry', async () => {
    history.replaceState(null, '', '/start/');
    const Router = await freshRouter();
    const obj = {};
    Router.history.subscribe(obj, '/a/');
    await wait();
    const { length } = history;

    obj.a = 'x';
    obj.a = 'start';
    await wait();

    expect(location.pathname).toBe('/start/');
    expect(history.length).toBe(length);
  });

  it('RT-1: the path set in another spelling (/start for /start/) adds no history entry', async () => {
    history.replaceState(null, '', '/start/');
    const Router = await freshRouter();
    Router.history.subscribe({}, '/a/');
    await wait();
    const { length } = history;

    Router.history.path = '/start';
    await wait();

    expect(location.pathname).toBe('/start/');
    expect(history.length).toBe(length);
  });

  it('RT-1: on a page opened at /start, the same route written back is rewritten to /start/ in place', async () => {
    history.replaceState(null, '', '/start?q=1#top');
    const Router = await freshRouter();
    const obj = {};
    Router.history.subscribe(obj, '/a/');
    await wait();
    expect(obj.a).toBe('start');
    const { length } = history;

    obj.a = 'x';
    obj.a = 'start';
    await wait();

    expect(location.href).toBe('http://localhost/start/?q=1#top');
    expect(history.length).toBe(length);
  });

  it('RT-2: a property that gets null makes the next ones null when the URL is already empty there', async () => {
    const Router = await freshRouter();
    const router = new Router('custom');
    const obj = {};
    router.subscribe(obj, '/a/b/');

    obj.b = 'y'; // not shown: a is empty
    expect(obj.b).toBe('y');
    obj.a = null;

    expect(router.path).toBe('/');
    expect(obj.b).toBe(null);
  });

  it('a change event triggered by hand, with no event object, resets nothing', async () => {
    const Router = await freshRouter();
    const router = new Router('custom');
    const obj = { a: 'x', b: 'y' };
    router.subscribe(obj, '/a/b/');

    trigger(obj, 'change:a');

    expect(router.path).toBe('/x/y/');
    expect(obj.b).toBe('y');
  });

  it('RT-2: on subscribe, a value after an empty part becomes null', async () => {
    const Router = await freshRouter();
    const router = new Router('custom');
    const obj = { b: 'y', c: 'z' };
    router.subscribe(obj, '/a/*/b/c/');

    expect(router.path).toBe('/');
    expect([obj.b, obj.c]).toEqual([null, null]);
  });

  it('RT-4: a route emptied on #!/x/ leaves the URL without a hash, in a new history entry', async () => {
    history.replaceState(null, '', '/page?q=1#!/x/');
    const Router = await freshRouter();
    const obj = {};
    Router.hash.subscribe(obj, '/a/');
    await wait();
    expect(obj.a).toBe('x');
    const { length } = history;

    obj.a = null;
    await wait();

    expect(location.href).toBe('http://localhost/page?q=1');
    expect(history.length).toBe(length + 1);
    expect(Router.hash.parts).toEqual([]);
  });

  it('DOC-1: Router.hash bound before any subscribe shows the URL and writes it back', async () => {
    history.replaceState(null, '', '/#!/users/42/');
    const Router = await freshRouter();
    document.body.innerHTML = '<i class="current-path"></i>';
    bindNode(Router.hash, 'path', '.current-path', binders.text());
    await wait();
    expect(document.querySelector('.current-path').textContent).toBe('/users/42/');

    Router.hash.path = '/a/b/';
    await wait();

    expect(Router.hash.parts).toEqual(['a', 'b']);
    expect(location.hash).toBe('#!/a/b/');
  });

  it('DOC-1: Router.history reads the URL before any subscribe; new Router(type) gives the singleton', async () => {
    history.replaceState(null, '', '/users/42/');
    const Router = await freshRouter();

    expect(Router.history.parts).toEqual(['users', '42']);
    expect(new Router('history')).toBe(Router.history);
    expect(new Router('hash')).toBe(Router.hash);
  });

  it('ES5-7: a for-in over a router lists its data only (dist assigns the class methods)', async () => {
    const Router = await freshRouter();

    expect(forInKeys(new Router('audit'))).toEqual(['parts', 'path', 'hashPath', 'type']);
    expect(Object.getOwnPropertyDescriptor(Router.prototype, 'init').enumerable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(Router.prototype, 'subscribe').enumerable).toBe(false);
  });
});
