import Matreshka, { bindNode, calc, binders, mediate } from 'src';

// the snippets of skills/matreshka/SKILL.md, run as written
const wait = () => new Promise((resolve) => setTimeout(resolve, 20));

describe('skills/matreshka examples', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('plain object: binding, calc and a text binder', async () => {
    document.body.innerHTML = '<input class="name"><span class="greeting"></span>';
    const page = {};
    bindNode(page, 'name', '.name');
    calc(page, 'greeting', 'name', (name) => name || 'stranger');
    bindNode(page, 'greeting', '.greeting', binders.text());
    await wait();
    expect(document.querySelector('.greeting').textContent).toBe('stranger');

    page.name = 'Ann';
    await wait();
    expect(document.querySelector('.name').value).toBe('Ann');
    expect(document.querySelector('.greeting').textContent).toBe('Ann');
  });

  it('class style chains bindNode and calc', () => {
    document.body.innerHTML = '<input class="name" value="Bob">';
    class Page extends Matreshka {
      constructor() {
        super();
        this.bindNode('name', '.name').calc('greeting', 'name', (name) => name || 'stranger');
      }
    }
    expect(new Page().greeting).toBe('Bob');
  });

  it('Matreshka.Array with Model, itemRenderer and recreate', async () => {
    document.body.innerHTML = '<ul class="users"></ul>';
    class User extends Matreshka.Object {}
    class Users extends Matreshka.Array {
      get Model() {
        return User;
      }
      get itemRenderer() {
        return '<li>{{name}}</li>';
      }
      constructor(data) {
        super();
        this.bindNode('sandbox', '.users').recreate(data);
      }
    }
    const users = new Users([{ name: 'a' }, { name: 'b' }]);
    await wait();
    expect(users[0]).toBeInstanceOf(User);
    expect(document.querySelector('.users').textContent).toBe('ab');
  });

  it('a custom binder added to Matreshka.binders', async () => {
    document.body.innerHTML = '<b></b>';
    Matreshka.binders.upper = () => ({
      setValue(value) {
        this.textContent = String(value).toUpperCase();
      }
    });
    try {
      const obj = { x: 'hi' };
      bindNode(obj, 'x', 'b', Matreshka.binders.upper());
      await wait();
      expect(document.querySelector('b').textContent).toBe('HI');
    } finally {
      delete Matreshka.binders.upper;
    }
  });

  it('mediate with Number keeps a cleared field empty', async () => {
    document.body.innerHTML = '<input class="x">';
    const obj = {};
    bindNode(obj, 'x', '.x');
    mediate(obj, 'x', Number);
    const input = document.querySelector('.x');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await wait();
    expect(obj.x).toBe(0);
    expect(input.value).toBe('');
  });
});
