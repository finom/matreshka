import MatreshkaArray from 'src/array';
import MatreshkaObject from 'src/object';
import delegateListener from 'src/on/_delegatelistener';
import undelegateListener from 'src/off/_undelegatelistener';
import trigger from 'src/trigger';
import createSpy from '../../helpers/createspy';

describe('Astrerisk events: delegateListener, undelegateListener', () => {
  it('allows to attatch "*" events to Matreshka.Array instance', () => {
    const obj = new MatreshkaArray();
    const handler = createSpy();

    delegateListener(obj, '*', 'someevent', handler);
    obj.push({});
    trigger(obj[0], 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('automatically removes "*" delegated event from Matreshka.Array instance' + 'if an item is removed', () => {
    const obj = new MatreshkaArray();
    const handler = createSpy();
    const item = {};

    delegateListener(obj, '*', 'someevent', handler);

    obj.push(item);
    obj.pop();
    trigger(item, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('allows to attatch "*" event to Matreshka.Object instance', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();

    delegateListener(obj, '*', 'someevent', handler);
    obj.setData('x', {});
    trigger(obj.x, 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('automatically removes "*" delegated event from Matreshka.Object instance' + ' if an item is removed', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();
    const item = {};

    delegateListener(obj, '*', 'someevent', handler);
    obj.setData('x', item);
    obj.remove('x');
    trigger(item, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes "*" events from Matreshka.Array instance', () => {
    const obj = new MatreshkaArray();
    const handler = createSpy();

    delegateListener(obj, '*', 'someevent', handler);
    obj.push({});
    undelegateListener(obj, '*', 'someevent');
    trigger(obj[0], 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes "*" events from Matreshka.Object instance', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();

    delegateListener(obj, '*', 'someevent', handler);
    obj.setData('x', {});
    undelegateListener(obj, '*', 'someevent');
    trigger(obj.x, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes "*" events from Matreshka.Array instance using callback', () => {
    const obj = new MatreshkaArray();
    const handler = createSpy();

    delegateListener(obj, '*', 'someevent', handler);
    obj.push({});
    undelegateListener(obj, '*', 'someevent', handler);
    trigger(obj[0], 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not remove "*" events from Matreshka.Array instance when wrong callback is given', () => {
    const obj = new MatreshkaArray();
    const handler = createSpy();

    delegateListener(obj, '*', 'someevent', handler);
    obj.push({});
    undelegateListener(obj, '*', 'someevent', () => {});
    trigger(obj[0], 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('removes "*" events from Matreshka.Object instance using callback', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();

    delegateListener(obj, '*', 'someevent', handler);
    obj.setData('x', {});
    undelegateListener(obj, '*', 'someevent', handler);
    trigger(obj.x, 'someevent');
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not remove "*" events from Matreshka.Object instance when wrong callback is given', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();

    delegateListener(obj, '*', 'someevent', handler);
    obj.setData('x', {});
    undelegateListener(obj, '*', 'someevent', () => {});
    trigger(obj.x, 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('allows to attatch "*" events to Matreshka.Array instance, go deeper (*.a)', () => {
    const obj = new MatreshkaArray();
    const handler = createSpy();

    delegateListener(obj, '*.a', 'someevent', handler);
    obj.push({
      a: {}
    });
    trigger(obj[0].a, 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('allows to attatch "*" events to Matreshka.Object instance, go deeper (*.a)', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();

    delegateListener(obj, '*.a', 'someevent', handler);
    obj.setData('x', {
      a: {}
    });
    trigger(obj.x.a, 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('allows to attatch "*" events to Matreshka.Array instance, go deeper (*.*)', () => {
    const obj = new MatreshkaArray();
    const handler = createSpy();

    delegateListener(obj, '*.*', 'someevent', handler);
    obj.push(new MatreshkaArray({}));
    trigger(obj[0][0], 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('allows to attatch "*" events to Matreshka.Object instance, go deeper (*.*)', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();

    delegateListener(obj, '*.*', 'someevent', handler);
    obj.setData(
      'x',
      new MatreshkaObject({
        a: {}
      })
    );
    trigger(obj.x.a, 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('allows to attatch "*" events to Matreshka.Array instance, go deeper (*.*.a)', () => {
    const obj = new MatreshkaArray();
    const handler = createSpy();

    delegateListener(obj, '*.*.a', 'someevent', handler);
    obj.push(
      new MatreshkaArray({
        a: {}
      })
    );
    trigger(obj[0][0].a, 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('allows to attatch "*" events to Matreshka.Object instance, go deeper (*.*.a)', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();

    delegateListener(obj, '*.*.a', 'someevent', handler);
    obj.setData(
      'x',
      new MatreshkaObject({
        y: new MatreshkaObject({
          a: {}
        })
      })
    );
    trigger(obj.x.y.a, 'someevent');
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
