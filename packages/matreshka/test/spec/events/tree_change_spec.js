import addTreeListner from 'src/on/_addtreelistener';
import removeTreeListner from 'src/off/_removetreelistener';
import makeObject from '../../helpers/makeobject';
import createSpy from '../../helpers/createspy';

describe('Tree change events (internal feature)', () => {
  it('should listen tree and should remove listeners from previous subtree', () => {
    const obj = makeObject('a.b.c.d.e');
    const handler = createSpy();
    addTreeListner(obj, 'a.b.c.d.e', handler);

    obj.a.b.c.d.e = {};
    expect(handler).toHaveBeenCalledTimes(1);

    // once again
    obj.a.b.c.d.e = {};
    expect(handler).toHaveBeenCalledTimes(2);

    const d = obj.a.b.c.d;
    obj.a.b.c.d = makeObject('e');
    d.e = {};
    expect(handler).toHaveBeenCalledTimes(3);

    const c = obj.a.b.c;
    obj.a.b.c = makeObject('d.e');
    c.d = makeObject('e');
    expect(handler).toHaveBeenCalledTimes(4);

    const b = obj.a.b;
    obj.a.b = makeObject('c.d.e');
    b.c = makeObject('d.e');
    expect(handler).toHaveBeenCalledTimes(5);

    const a = obj.a;
    obj.a = makeObject('b.c.d.e');
    a.b = makeObject('c.d.e');
    expect(handler).toHaveBeenCalledTimes(6);

    obj.a.b.c.d.e = {};
    expect(handler).toHaveBeenCalledTimes(7);

    obj.a.b.c.d = {};
    expect(handler).toHaveBeenCalledTimes(8);

    obj.a.b.c = {};
    expect(handler).toHaveBeenCalledTimes(9);

    obj.a.b = {};
    expect(handler).toHaveBeenCalledTimes(10);

    obj.a = {};
    expect(handler).toHaveBeenCalledTimes(11);

    obj.a.b = {};
    expect(handler).toHaveBeenCalledTimes(12);

    obj.a.b.c = {};
    expect(handler).toHaveBeenCalledTimes(13);

    obj.a.b.c.d = {};
    expect(handler).toHaveBeenCalledTimes(14);

    obj.a.b.c.d.e = {};
    expect(handler).toHaveBeenCalledTimes(15);

    obj.a = {};
    expect(handler).toHaveBeenCalledTimes(16);
  });

  it('should remove tree listener by callback', () => {
    const obj = makeObject('a.b.c');
    const handler = createSpy();
    addTreeListner(obj, 'a.b.c', handler);
    removeTreeListner(obj, 'a.b.c', handler);

    obj.a.b.c = {};
    expect(handler).not.toHaveBeenCalled();

    obj.a.b = makeObject('c');
    expect(handler).not.toHaveBeenCalled();

    obj.a = makeObject('b.c');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove tree listener without callback', () => {
    const obj = makeObject('a.b.c');
    const handler = createSpy();
    addTreeListner(obj, 'a.b.c', handler);
    removeTreeListner(obj, 'a.b.c');

    obj.a.b.c = {};
    expect(handler).not.toHaveBeenCalled();

    obj.a.b = makeObject('c');
    expect(handler).not.toHaveBeenCalled();

    obj.a = makeObject('b.c');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should not remove tree listener by wrong callback', () => {
    const obj = makeObject('a.b.c');
    const handler = createSpy();
    addTreeListner(obj, 'a.b.c', handler);
    removeTreeListner(obj, 'a.b.c', () => {});

    obj.a.b.c = {};
    expect(handler).toHaveBeenCalledTimes(1);

    obj.a.b = makeObject('c');
    expect(handler).toHaveBeenCalledTimes(2);

    obj.a = makeObject('b.c');
    expect(handler).toHaveBeenCalledTimes(3);
  });
});
