import addListener from 'src/on/_addlistener';
import delegateListener from 'src/on/_delegatelistener';
import undelegateListener from 'src/off/_undelegatelistener';
import removeListener from 'src/off/_removelistener';
import makeObject from '../../helpers/makeobject';
import createSpy from '../../helpers/createspy';

describe('Change event (simple and delegated)', () => {
  let handler;

  beforeEach(() => {
    handler = createSpy();
  });

  it('fires simple', () => {
    const obj = { x: 1 };

    addListener(obj, 'change:x', handler);
    obj.x = 2;
    expect(handler).toHaveBeenCalled();
  });

  it('fires delegated (a.x)', () => {
    const obj = makeObject('a.x', 1);

    delegateListener(obj, 'a', 'change:x', handler);
    obj.a.x = 2;
    expect(handler).toHaveBeenCalled();
  });

  it('fires delegated (a.b.x)', () => {
    const obj = makeObject('a.b.x', 1);

    delegateListener(obj, 'a.b', 'change:x', handler);
    obj.a.b.x = 2;
    expect(handler).toHaveBeenCalled();
  });

  it('removes simple', () => {
    const obj = { x: 1 };

    addListener(obj, 'change:x', handler);
    removeListener(obj, 'change:x', handler);
    obj.x = 2;
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes delegated (a.x)', () => {
    const obj = makeObject('a.x', 1);

    delegateListener(obj, 'a', 'change:x', handler);
    undelegateListener(obj, 'a', 'change:x', handler);
    obj.a.x = 2;
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes delegated (a.b.x)', () => {
    const obj = makeObject('a.b.x', 1);

    delegateListener(obj, 'a.b', 'change:x', handler);
    undelegateListener(obj, 'a.b', 'change:x', handler);
    obj.a.b.x = 2;
    expect(handler).not.toHaveBeenCalled();
  });

  it('fires delegated (a.b.x)', () => {
    const obj = makeObject('a.b.x', 1);

    delegateListener(obj, 'a.b', 'change:x', handler);
    obj.a.b.x = 2;
    expect(handler).toHaveBeenCalled();
  });

  it('accepts null target (a.b.c, reassign b)', () => {
    const obj = makeObject('a.b.c.x', 1);
    delegateListener(obj, 'a.b.c', 'someevent', handler);

    expect(() => {
      obj.a.b = null;
    }).not.toThrow();
  });
});
