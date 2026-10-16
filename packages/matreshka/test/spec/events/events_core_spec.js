import addListener from 'src/on/_addlistener';
import removeListener from 'src/off/_removelistener';
import triggerOne from 'src/trigger/_triggerone';
import createSpy from '../../helpers/createspy';

describe('Events core (addListener, removeListener, triggerOne)', () => {
  let obj;
  let ctx;
  let handler;

  beforeEach(() => {
    obj = {};
    ctx = {};
    handler = createSpy();
  });

  it('fires', () => {
    addListener(obj, 'someevent', handler);
    triggerOne(obj, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('avoids conflicts', () => {
    let i = 0;
    addListener(obj, 'someevent', () => (i += 1));
    addListener(obj, 'someevent', () => (i += 1e1));
    addListener(obj, 'someevent', () => (i += 1e2));
    triggerOne(obj, 'someevent');

    expect(i).toEqual(111);
  });

  it('removes all', () => {
    addListener(obj, 'someevent', handler);
    removeListener(obj);
    triggerOne(obj, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes by name', () => {
    addListener(obj, 'someevent', handler);
    removeListener(obj, 'someevent');
    triggerOne(obj, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes by callback', () => {
    addListener(obj, 'someevent', handler);
    removeListener(obj, 'someevent', handler);
    triggerOne(obj, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes by callback but keeps when callbacks are not same', () => {
    addListener(obj, 'someevent', handler);
    removeListener(obj, 'someevent', () => {});
    triggerOne(obj, 'someevent');
    expect(handler).toHaveBeenCalled();
  });

  it('removes by callback and context', () => {
    addListener(obj, 'someevent', handler, ctx);
    removeListener(obj, 'someevent', handler, ctx);
    triggerOne(obj, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes by callback but keeps when contexts are not same', () => {
    addListener(obj, 'someevent', handler, ctx);
    removeListener(obj, 'someevent', handler, {});
    triggerOne(obj, 'someevent');
    expect(handler).toHaveBeenCalled();
  });
});
