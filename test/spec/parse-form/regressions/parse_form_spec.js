// Regressions found by the 2026 sweep; the ids are the audit's.
import Matreshka from 'matreshka';
import { parseForm } from 'src/parse-form';

const noDebounce = { debounceGetValue: false, debounceSetValue: false };

describe('parseForm regressions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<input name="outside" value="o">';
  });

  it('PF-1: binds nothing when the form selector matches nothing', () => {
    const obj = {};
    expect(parseForm(obj, '.missing', null, noDebounce)).toBe(null);
    expect(obj.outside).toBe(undefined);
  });

  it('PF-1: binds nothing when :sandbox is used and no sandbox is bound', () => {
    const obj = new Matreshka();
    expect(parseForm(obj, ':sandbox', null, noDebounce)).toBe(null);
    expect(obj.outside).toBe(undefined);
  });

  it('PF-2: throws its own TypeError for a wrong object before looking up the form', () => {
    expect(() => parseForm(null, ':sandbox form')).toThrow(
      new TypeError('parseForm should accept an object or a function as the first argument')
    );
  });

  it('PF-3: binds a field placed outside the form with the form attribute', () => {
    document.body.innerHTML = '<form id="f"><input name="a" value="1"></form><input name="b" form="f" value="2">';
    const obj = {};
    parseForm(obj, '#f', null, noDebounce);
    expect(obj.a).toBe('1');
    expect(obj.b).toBe('2');
  });

  it('PF-4: does not extend Matreshka when imported as a module (README: "Matreshka is not extended")', () => {
    expect(Matreshka.parseForm).toBe(undefined);
  });

  it('PF-5: does not crash on :sandbox for a plain object that has no bindings yet', () => {
    expect(() => parseForm({}, ':sandbox form', null, noDebounce)).not.toThrow();
  });

  it('PF-1: an empty selector binds nothing and does not throw', () => {
    const obj = {};
    expect(parseForm(obj, '', null, noDebounce)).toBe(null);
    expect(obj.outside).toBe(undefined);
  });

  it('a container that is not a form still binds its fields', () => {
    document.body.innerHTML =
      '<div class="c"><input name="a" value="1"><select name="s"><option>x</option></select></div>';
    const obj = {};
    parseForm(obj, '.c', null, noDebounce);
    expect(obj.a).toBe('1');
    expect(obj.s).toBe('x');
  });

  it('R6: binds <input type="image">, which form.elements leaves out, in document order', () => {
    document.body.innerHTML = '<form id="f"></form><input name="ext" form="f">';
    const form = document.querySelector('#f');
    form.innerHTML = '<input type="image" name="img"><input name="a">';
    const names = [];
    parseForm({}, form, (name) => names.push(name), noDebounce);
    expect(names).toEqual(['img', 'a', 'ext']);
  });

  it('R6: skips a field inside the form that the form attribute ties to another form', () => {
    document.body.innerHTML = '<form id="f"><input name="a"><input name="other" form="g"></form><form id="g"></form>';
    const names = [];
    parseForm({}, '#f', (name) => names.push(name), noDebounce);
    expect(names).toEqual(['a']);
  });
});
