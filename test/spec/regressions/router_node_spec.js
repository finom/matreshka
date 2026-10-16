// @vitest-environment node
import { Router } from 'src/router';

describe('the router without a DOM', () => {
  it('keeps the properties and the path in sync', () => {
    const obj = {};
    const router = new Router('hash').subscribe(obj, 'a/b');
    router.path = '/x/y/';
    expect([obj.a, obj.b]).toEqual(['x', 'y']);
    obj.b = 'z';
    expect(router.path).toBe('/x/z/');
  });
});
