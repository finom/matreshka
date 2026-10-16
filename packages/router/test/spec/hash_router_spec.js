import Router from '../../src/router';

const { document } = window;

describe('Hash routing', () => {
  const obj = { a: 'foo' };
  new Router('hash').subscribe(obj, 'a/b/c/d');

  it('initializes correctly', () =>
    new Promise((done) => {
      expect(obj.a).toEqual('foo');
      expect(obj.b).toEqual(null);
      expect(obj.c).toEqual(null);
      expect(obj.d).toEqual(null);

      setTimeout(() => {
        expect(document.location.hash).toEqual('#!/foo/');
        done();
      }, 50);
    }));

  it('changes properties when URL (hash) is changed', () =>
    new Promise((done) => {
      document.location.hash = '#!/bar/baz/qux/';

      setTimeout(() => {
        expect(obj.a).toEqual('bar');
        expect(obj.b).toEqual('baz');
        expect(obj.c).toEqual('qux');
        expect(obj.d).toEqual(null);
        done();
      }, 50);
    }));

  it('changes URL (hash) when property is changed', () =>
    new Promise((done) => {
      obj.b = 'lol';
      setTimeout(() => {
        expect(document.location.hash).toEqual('#!/bar/lol/qux/');
        done();
      }, 50);
    }));
});
