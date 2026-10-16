import { Router } from 'src/router';

describe('Gapped router (API test)', () => {
  const obj = {
    a: 'foo',
    b: 'bar',
    c: 'baz'
  };
  const router = new Router(null).subscribe(obj, 'a/*/c/*/e/f');

  it('initializes correctly', () => {
    expect(obj.a).toEqual('foo');
    expect(obj.b).toEqual('bar');
    expect(obj.c).toEqual(null); // because 2nd part is not set
    expect(obj.d).toEqual(undefined);
    expect(obj.e).toEqual(null);
    expect(obj.f).toEqual(null);
  });

  it('changes properties when URL is changed', () => {
    router.path = '/bar/baz/qux/eggs/bat/lol/';

    expect(obj.a).toEqual('bar');
    expect(obj.b).toEqual('bar');
    expect(obj.c).toEqual('qux');
    expect(obj.d).toEqual(undefined);
    expect(obj.e).toEqual('bat');
    expect(obj.f).toEqual('lol');
  });

  it('changes URL when property is changed', () => {
    obj.c = 'poo';
    expect(router.path).toEqual('/bar/baz/poo/eggs/bat/lol/');
    expect(router.hashPath).toEqual('#!/bar/baz/poo/eggs/bat/lol/');
  });

  it('sets further parts as null if one of parts is null', () => {
    obj.c = null;

    expect(obj.a).toEqual('bar');
    expect(obj.b).toEqual('bar');
    expect(obj.c).toEqual(null);
    expect(obj.d).toEqual(undefined);
    expect(obj.e).toEqual(null);
    expect(obj.f).toEqual(null);
  });
});
