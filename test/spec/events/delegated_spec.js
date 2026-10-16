import delegateListener from 'src/on/_delegatelistener';
import undelegateListener from 'src/off/_undelegatelistener';
import triggerOne from 'src/trigger/_triggerone';
import makeObject from '../../helpers/makeobject';
import createSpy from '../../helpers/createspy';

describe('Delegated events (delegateListener, undelegateListener)', () => {
  let ctx;
  let handler;

  beforeEach(() => {
    ctx = {};
    handler = createSpy();
  });

  it('fires (a.b)', () => {
    const obj = makeObject('a.b');

    delegateListener(obj, 'a.b', 'someevent', handler);
    triggerOne(obj.a.b, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('fires (a.b.c)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('fires when reassigned (a.b, reassign a)', () => {
    const obj = makeObject('a.b');

    delegateListener(obj, 'a.b', 'someevent', handler);
    obj.a = makeObject('b');
    triggerOne(obj.a.b, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('fires when reassigned (a.b, reassign b)', () => {
    const obj = makeObject('a.b');

    delegateListener(obj, 'a.b', 'someevent', handler);
    obj.a.b = {};
    triggerOne(obj.a.b, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('fires when reassigned (a.b.c, reassign a)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    obj.a = makeObject('b.c');
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('fires when reassigned (a.b.c, reassign b)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    obj.a.b = makeObject('c');
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('fires when reassigned (a.b.c, reassign c)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    obj.a.b.c = {};
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('remove event from previous object when reassigned (a.b, reassign a)', () => {
    const obj = makeObject('a.b');
    const a = obj.a;

    delegateListener(obj, 'a.b', 'someevent', handler);
    obj.a = makeObject('b');
    triggerOne(a.b, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('remove event from previous object when reassigned (a.b, reassign b)', () => {
    const obj = makeObject('a.b');
    const b = obj.a.b;

    delegateListener(obj, 'a.b', 'someevent', handler);
    obj.a.b = {};
    triggerOne(b, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('remove event from previous object when reassigned (a.b.c, reassign a)', () => {
    const obj = makeObject('a.b.c');
    const a = obj.a;

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    obj.a = makeObject('b.c');
    triggerOne(a.b.c, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('remove event from previous object when reassigned (a.b.c, reassign b)', () => {
    const obj = makeObject('a.b.c');
    const b = obj.a.b;

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    obj.a.b = makeObject('c');
    triggerOne(b.c, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('remove event from previous object when reassigned (a.b.c, reassign c)', () => {
    const obj = makeObject('a.b.c');
    const c = obj.a.c;

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    obj.a.b.c = {};
    triggerOne(c, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('undelegate (a.b)', () => {
    const obj = makeObject('a.b');

    delegateListener(obj, 'a.b', 'someevent', handler);
    undelegateListener(obj, 'a.b', 'someevent');
    triggerOne(obj.a.b, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('undelegate (a.b.c)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    undelegateListener(obj, 'a.b.c', 'someevent');
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not remove change event when undelegated (a.b.c)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', () => {});
    delegateListener(obj, 'a.b', 'change:c', handler);
    undelegateListener(obj, 'a.b.c', 'someevent');
    obj.a.b.c = 55;
    expect(handler).toHaveBeenCalled();
  });

  it('undelegates by callback (a.b)', () => {
    const obj = makeObject('a.b');

    delegateListener(obj, 'a.b', 'someevent', handler);
    undelegateListener(obj, 'a.b', 'someevent', handler);
    triggerOne(obj.a.b, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('undelegates by callback (a.b.c)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    undelegateListener(obj, 'a.b.c', 'someevent', handler);
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('undelegates by callback and context (a.b)', () => {
    const obj = makeObject('a.b');

    delegateListener(obj, 'a.b', 'someevent', handler, ctx);
    undelegateListener(obj, 'a.b', 'someevent', handler, ctx);
    triggerOne(obj.a.b, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('undelegates by callback and context (a.b.c)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler, ctx);
    undelegateListener(obj, 'a.b.c', 'someevent', handler, ctx);
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('undelegates by callback but keeps when callbacks are not same (a.b)', () => {
    const obj = makeObject('a.b');

    delegateListener(obj, 'a.b', 'someevent', handler);
    undelegateListener(obj, 'a.b', 'someevent', () => {});
    triggerOne(obj.a.b, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('undelegates by callback but keeps when callbacks are not same (a.b.c)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler);
    undelegateListener(obj, 'a.b.c', 'someevent', () => {});
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('undelegates by callback but keeps when contexts are not same (a.b)', () => {
    const obj = makeObject('a.b');

    delegateListener(obj, 'a.b', 'someevent', handler, {});
    undelegateListener(obj, 'a.b', 'someevent', handler, {});
    triggerOne(obj.a.b, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('undelegates by callback but keeps when contexts are not same (a.b.c)', () => {
    const obj = makeObject('a.b.c');

    delegateListener(obj, 'a.b.c', 'someevent', handler, {});
    undelegateListener(obj, 'a.b.c', 'someevent', handler, {});
    triggerOne(obj.a.b.c, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('uses correct context for delegated events', () => {
    const obj = makeObject('a.b.c');
    let bool = false;

    delegateListener(
      obj,
      'a.b.c',
      'someevent',
      function handle() {
        bool = this === ctx;
      },
      ctx
    );

    triggerOne(obj.a.b.c, 'someevent');
    expect(bool).toBe(true);
  });
});
