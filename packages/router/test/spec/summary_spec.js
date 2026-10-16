import Router from '../../src/router';
import initRouter from '../../src';

const { document, location, history, Event } = window;

describe('Summary', () => {
  beforeEach(() => {
    Router.history.path = '';
    Router.hash.path = '';
  });

  it('has correct instances', () => {
    expect(Router.hash instanceof Router).toBeTruthy();
    expect(Router.history instanceof Router).toBeTruthy();

    expect(Router.hash.type).toEqual('hash');
    expect(Router.history.type).toBeTruthy('history');
  });

  it('allows to subscribe via static method', () =>
    new Promise((done) => {
      const obj = {
        a: 'foo',
        b: 'bar',
        c: 'baz'
      };

      initRouter(obj, '/a/b/c/');

      expect(Router.hash.path).toEqual('/foo/bar/baz/');

      setTimeout(() => {
        expect(document.location.hash).toEqual('#!/foo/bar/baz/');
        done();
      }, 100);
    }));

  it(
    "doesn't make collisions when an object" + 'subscribes to both hash and history router',
    () =>
      new Promise((done) => {
        const obj = {
          a: 'cfoo',
          b: 'cbar',
          c: 'cbaz',
          d: 'cqux',
          e: 'cpoo',
          f: 'czum'
        };

        initRouter(obj, '/a/b/c/');
        initRouter(obj, '/d/e/f/', 'history');

        expect(Router.hash.path).toEqual('/cfoo/cbar/cbaz/');
        expect(Router.history.path).toEqual('/cqux/cpoo/czum/');

        setTimeout(() => {
          expect(document.location.hash).toEqual('#!/cfoo/cbar/cbaz/');
          expect(document.location.pathname).toEqual('/cqux/cpoo/czum/');
          done();
        }, 50);
      })
  );

  it('allows to walk thru the history via hash router', () =>
    new Promise((done) => {
      const obj = {
        a: 'wfoo',
        b: 'wbar',
        c: 'wbaz'
      };

      initRouter(obj, '/a/b/c/');

      setTimeout(() => {
        expect(document.location.hash).toEqual('#!/wfoo/wbar/wbaz/');
        obj.a = 'wzoo';

        setTimeout(() => {
          expect(document.location.hash).toEqual('#!/wzoo/wbar/wbaz/');
          expect(obj.a).toEqual('wzoo');
          history.back();

          setTimeout(() => {
            expect(document.location.hash).toEqual('#!/wfoo/wbar/wbaz/');

            expect(obj.a).toEqual('wfoo');
            done();
          }, 50);
        }, 50);
      }, 50);
    }));

  it('allows to walk thru the history via history router', () =>
    new Promise((done) => {
      const obj = {
        a: 'wqux',
        b: 'wpoo',
        c: 'wzum'
      };

      initRouter(obj, '/a/b/c/', 'history');

      setTimeout(() => {
        expect(document.location.pathname).toEqual('/wqux/wpoo/wzum/');
        obj.a = 'wzoo';

        setTimeout(() => {
          expect(document.location.pathname).toEqual('/wzoo/wpoo/wzum/');
          expect(obj.a).toEqual('wzoo');

          history.back();

          setTimeout(() => {
            expect(document.location.pathname).toEqual('/wqux/wpoo/wzum/');

            expect(obj.a).toEqual('wqux');

            done();
          }, 50);
        }, 50);
      }, 50);
    }));

  it('gets default value of hash on initialization', () =>
    new Promise((done) => {
      history.pushState({}, '', '/pfoo/pbar/pbaz/');
      location.hash = '#!/hfoo/hbar/hbaz/';

      const popstateEvent = new Event('popstate');
      popstateEvent.state = {
        validPush: true
      };
      window.dispatchEvent(popstateEvent);

      const obj = {
        c: 'quu',
        f: 'boo'
      };

      setTimeout(() => {
        initRouter(obj, '/a/b/c/');
        initRouter(obj, '/d/e/f/', 'history');

        setTimeout(() => {
          expect(location.hash).toEqual('#!/hfoo/hbar/quu/');
          expect(location.pathname).toEqual('/pfoo/pbar/boo/');

          expect(obj.a).toEqual('hfoo');
          expect(obj.b).toEqual('hbar');
          expect(obj.c).toEqual('quu');
          expect(obj.d).toEqual('pfoo');
          expect(obj.e).toEqual('pbar');
          expect(obj.f).toEqual('boo');

          done();
        }, 50);
      }, 50);
    }));
});
