import Matreshka from 'src';
import MatreshkaArray from 'src/array';
import MatreshkaObject from 'src/object';
import matreshkaError from 'src/_helpers/matreshkaerror';

describe('Errors', () => {
  const noDebounce = { debounceGetValue: false, debounceSetValue: false };

  it('reports a wrong object type', () => {
    expect(() => Matreshka.bindNode(null, 'x', '.y')).toThrow(
      'Error in bindNode: object must have type "object" but got "null" instead.'
    );
  });

  it('refuses to call a class as a function', () => {
    expect(() => Matreshka()).toThrow('Cannot call a class as a function');
    expect(() => MatreshkaArray()).toThrow('Cannot call a class as a function');
    expect(() => MatreshkaObject()).toThrow('Cannot call a class as a function');
  });

  it('refuses to use sandbox as a regular property', () => {
    const object = new Matreshka();
    object.bindNode('sandbox', document.createElement('div'));
    expect(() => object.sandbox).toThrow('"sandbox" key (for all objects) and "container" key');
  });

  it('reports a missing node with the selector', () => {
    expect(() => Matreshka.bindNode({}, 'x', '.missing')).toThrow(
      'Binding error: node is missing for key "x" (given selector is ".missing").'
    );
  });

  it('refuses a falsy key', () => {
    expect(() => Matreshka.bindNode({}, '', document.createElement('div'))).toThrow(
      'Binding error: "key" arg cannot be falsy'
    );
  });

  it('reports missing nodes and $nodes of an instance', () => {
    const object = new Matreshka();
    object.nodes = null;
    expect(() => object.bindNode('x', document.createElement('div'), null, noDebounce)).toThrow(
      'Binding error: "nodes" property of Matreshka instance is missing.'
    );
    const another = new Matreshka();
    another.$nodes = null;
    expect(() => another.bindNode('x', document.createElement('div'), null, noDebounce)).toThrow(
      'Binding error: "$nodes" property of Matreshka instance is missing.'
    );
  });

  it('refuses more than one sandbox node', () => {
    expect(() => Matreshka.bindNode({}, 'sandbox', [document.createElement('a'), document.createElement('b')])).toThrow(
      'cannot have more than one bound node'
    );
  });

  it('reports a renderer returning a wrong number of nodes', () => {
    const array = new MatreshkaArray();
    array.bindNode('container', document.createElement('div'));
    array.itemRenderer = '<a></a><b></b>';
    expect(() => array.push({})).toThrow('renderer returned 2 nodes instead of one. To fix this wrap these nodes');
  });

  it('reports a missing renderer node', () => {
    const array = new MatreshkaArray();
    array.bindNode('container', document.createElement('div'));
    array.itemRenderer = ':sandbox .missing';
    expect(() => array.push({})).toThrow('renderer node is missing (given selector is ":sandbox .missing")');
  });

  it('reports a wrong Model type', () => {
    const array = new MatreshkaArray();
    expect(() => {
      array.Model = 'not a function';
    }).toThrow('Matreshka.Array error: Model must have type "function" but got "string" instead.');
  });

  it('reports a wrong pull argument', () => {
    expect(() => new MatreshkaArray(1, 2).pull('a')).toThrow('Error in pull: toRemove must have type "number"');
  });

  it('reports restore without a container', () => {
    expect(() => new MatreshkaArray().restore()).toThrow('cannot find any container to restore an instance');
  });

  it('reports wrong event names', () => {
    expect(() => Matreshka.on({}, 1, () => {})).toThrow('Events error: event name must have type "string"');
    expect(() => Matreshka.trigger({}, 1)).toThrow('Events error: event name must have type "string"');
  });

  it('reports wrong keys of data methods', () => {
    expect(() => new MatreshkaObject().addDataKeys(1)).toThrow('Error in addDataKeys: key must have type "string"');
    expect(() => new MatreshkaObject().removeDataKeys(1)).toThrow(
      'Error in removeDataKeys: key must have type "string"'
    );
    expect(() => Matreshka.remove({}, 1)).toThrow('Error in remove: key must have type "string"');
    expect(() => Matreshka.mediate({}, 1, (v) => v)).toThrow('Error in mediate: key must have type "string"');
  });

  it('reports an unknown error key', () => {
    expect(() => matreshkaError('no:such_error')).toThrow('Unknown error "no:such_error"');
  });
});
