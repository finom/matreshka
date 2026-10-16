import remove from 'src/remove';
import on from 'src/on';
import bindNode from 'src/bindnode';
import trigger from 'src/trigger';
import select from 'src/select';
import createSpy from '../helpers/createspy';

describe('remove', () => {
  it('removes a property', () => {
    const obj = {
      a: 1
    };

    remove(obj, 'a');
    expect('a' in obj).toBe(false);
  });

  it('removes a property in context of an object which has isMatreshka=true property', () => {
    const obj = {
      a: 1,
      isMatreshka: true
    };

    remove.call(obj, 'a');
    expect('a' in obj).toBe(false);
  });

  it('removes a property and its events', () => {
    const obj = {
      a: 1
    };
    const handler = createSpy();

    on(obj, 'change:a', handler);
    trigger(obj, 'change:a');
    expect(handler).toHaveBeenCalledTimes(1);
    remove(obj, 'a');
    trigger(obj, 'change:a');
    expect(handler).toHaveBeenCalledTimes(1);
    expect('a' in obj).toBe(false);
  });

  it('removes a property and its bindings', () => {
    const obj = {
      a: 1
    };
    const node = window.document.createElement('div');

    bindNode(obj, 'a', node);
    expect(select(obj, ':bound(a)')).toEqual(node);
    remove(obj, 'a');
    expect(select(obj, ':bound(a)')).toEqual(null);
    expect('a' in obj).toBe(false);
  });
});
