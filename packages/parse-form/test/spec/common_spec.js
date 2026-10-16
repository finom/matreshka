import parseForm from '../../src';

const noDebounceFlag = { debounceGetValue: false, debounceSetValue: false };

describe('Common', () => {
  it('runs all the stuff', () => {
    const spyObject = {
      spy(key, node) {
        expect(key).toEqual('x');
        expect(node.name).toEqual('x');
        expect(node.tagName).toEqual('INPUT');
      }
    };

    const object = {};

    vi.spyOn(spyObject, 'spy');

    const form = parseForm(
      object,
      `<form>
            <input type="text" name="x">
        </form>`,
      spyObject.spy,
      noDebounceFlag
    );

    object.x = 'foo';

    expect(form.querySelector('[name="x"]').value).toEqual('foo');
    expect(spyObject.spy).toHaveBeenCalledTimes(1);
  });
});
