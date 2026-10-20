import Matreshka from 'src/bundle';

// The docs samples as the pages print them now, checked against what their comments say.
const wait = async () => {
  for (let i = 0; i < 5; i++) await new Promise((resolve) => setTimeout(resolve, 0));
};
const $ = (selector) => document.querySelector(selector);

afterEach(() => {
  document.body.innerHTML = '';
});

describe('docs samples, sweep 5', () => {
  it('DOC-2 faq.md: one object in two collections changes both bound nodes', async () => {
    document.body.innerHTML = '<ul class="a"></ul><ul class="b"></ul>';
    let UsersA;
    let UsersB;
    class User extends Matreshka.Object {
      constructor() {
        super();
        this.bindRenderedAsSandbox = false;
      }
      onRender(evt) {
        const { parentArray, node } = evt;
        if (parentArray instanceof UsersA) {
          this.bindNode({
            nodeA: node,
            name: { node: ':bound(nodeA) .name', binder: Matreshka.binders.text() },
            email: { node: ':bound(nodeA) .email', binder: Matreshka.binders.text() }
          });
        } else if (parentArray instanceof UsersB) {
          this.bindNode({
            nodeB: node,
            name: { node: ':bound(nodeB) .user-name', binder: Matreshka.binders.text() }
          });
        }
      }
    }
    UsersA = class extends Matreshka.Array {
      get Model() {
        return User;
      }
      itemRenderer = '<li><span class="name"></span><span class="email"></span></li>';
      constructor() {
        super().bindNode('sandbox', '.a');
      }
    };
    UsersB = class extends Matreshka.Array {
      get Model() {
        return User;
      }
      itemRenderer = '<li><span class="user-name"></span></li>';
      constructor() {
        super().bindNode('sandbox', '.b');
      }
    };
    const user = new User();
    new UsersA().push(user);
    new UsersB().push(user);
    await wait();
    user.name = 0.5;
    user.email = 'x@example.com';
    await wait();
    expect($('.name').textContent).toBe('0.5');
    expect($('.email').textContent).toBe('x@example.com');
    expect($('.user-name').textContent).toBe('0.5');
  });

  it('DOC-3 restore.md: the restored items and the pushed one come out of toJSON', async () => {
    document.body.innerHTML = `<ul class="collection-node">
      <li>One</li><li>Two</li><li>Three</li>
      <script type="text/html" class="renderer"><li></li></script>
    </ul>`;
    class MyModel extends Matreshka.Object {
      constructor(data) {
        super(data);
        this.addDataKeys('value');
      }
      onRender() {
        this.bindNode('value', ':sandbox', Matreshka.binders.html());
      }
    }
    class MyCollection extends Matreshka.Array {
      get Model() {
        return MyModel;
      }
      get itemRenderer() {
        return ':sandbox .renderer';
      }
      constructor() {
        super().bindNode('sandbox', '.collection-node').restore(':sandbox li');
      }
    }
    const myCollection = new MyCollection();
    myCollection.push({ value: 'Four' });
    await wait();
    expect(myCollection.toJSON()).toEqual([{ value: 'One' }, { value: 'Two' }, { value: 'Three' }, { value: 'Four' }]);
    expect($('.collection-node').querySelectorAll('li').length).toBe(4);
  });

  it('DOC-4 instantiate.md: new appData keeps the structure, settings included', () => {
    class Credentials extends Matreshka.Object {}
    class Settings extends Matreshka.Object {
      constructor(data) {
        super(data).instantiate('credentials', Credentials);
      }
    }
    class Friend extends Matreshka.Object {}
    class Friends extends Matreshka.Array {
      get Model() {
        return Friend;
      }
      trackBy = 'id';
      constructor(data) {
        super(...data);
      }
    }
    class AppData extends Matreshka.Object {
      constructor(data) {
        super(data).instantiate({
          friends: Friends,
          settings: Settings
        });
      }
    }
    class App extends Matreshka {
      constructor(appData) {
        super();
        this.appData = appData;
        this.instantiate('appData', AppData);
      }
    }
    const app = new App({
      settings: { name: 'Vasiliy Vasiliev', credentials: { email: 'vasia.vasia@gmail.com' } },
      friends: [
        { name: 'Yulia Zuyeva', id: 1 },
        { name: 'Konstantin Konstantinopolsky', id: 2 },
        { name: 'nagibator3000', id: 3 }
      ]
    });
    const { settings } = app.appData;
    const { credentials } = settings;
    const [yulia] = app.appData.friends;
    expect(settings).toBeInstanceOf(Settings);
    expect(credentials).toBeInstanceOf(Credentials);

    app.appData = {
      settings: { name: 'Petr Petrov', credentials: { email: 'petr.petrov@gmail.com' } },
      friends: [
        { name: 'Yulechka Zuyeva', id: 1 },
        { name: 'Konstantin Konstantinopolsky', id: 2 }
      ]
    };
    expect(app.appData.settings).toBe(settings);
    expect(app.appData.settings.credentials).toBe(credentials);
    expect(settings.name).toBe('Petr Petrov');
    expect(credentials.email).toBe('petr.petrov@gmail.com');
    expect(app.appData.friends[0]).toBe(yulia);
    expect(app.appData.friends.length).toBe(2);
  });

  it('DOC-5 on-item-render.md: onRender binds the checkbox and the text of the rendered item', async () => {
    document.body.innerHTML = '<form class="my-form"></form>';
    const items = [];
    class MyModel extends Matreshka.Object {
      onRender() {
        this.bindNode('isChecked', ':sandbox .my-checkbox');
        this.bindNode('text', ':sandbox .text', Matreshka.binders.html());
      }
    }
    class MyArray extends Matreshka.Array {
      get Model() {
        return MyModel;
      }
      itemRenderer() {
        return `<label>
          <input type="checkbox" class="my-checkbox">
          <span class="text"></span>
        </label>`;
      }
      constructor() {
        super().bindNode('sandbox', '.my-form');
      }
      onItemRender(item) {
        items.push(item);
      }
    }
    const app = new MyArray();
    app.push({ isChecked: true, text: 'Buy a raccoon' });
    await wait();
    expect($('.my-checkbox').checked).toBe(true);
    expect($('.text').textContent).toBe('Buy a raccoon');
    // the first argument is the item, not a node
    expect(items).toEqual([app[0]]);
    expect(items[0]).toBeInstanceOf(MyModel);
  });

  it('DOC-6 track-by.md: the object with _id 1 is reused as BarNew, _id 3 is new', () => {
    class MyArray extends Matreshka.Array {
      get trackBy() {
        return '_id';
      }
    }
    const arr = new MyArray();
    arr.recreate([
      { _id: 0, name: 'Foo' },
      { _id: 1, name: 'Bar' },
      { _id: 2, name: 'Baz' }
    ]);
    const before = Array.from(arr);
    arr.recreate([
      { _id: 1, name: 'BarNew' },
      { _id: 3, name: 'Qux' },
      { _id: 2, name: 'BazNew' }
    ]);
    const byId = (id) => arr.find((item) => item._id === id);
    expect(byId(1)).toBe(before[1]);
    expect(byId(1).name).toBe('BarNew');
    expect(byId(2)).toBe(before[2]);
    expect(byId(2).name).toBe('BazNew');
    expect(before).not.toContain(byId(3));
    expect(Array.from(arr)).not.toContain(before[0]);
    expect(arr.map((item) => item._id).toJSON()).toEqual([1, 3, 2]);
  });

  it('DOC-7 progress.md and style.md: the selectors name the bound node', async () => {
    document.body.innerHTML = '<progress class="my-progress" max="100"></progress><div class="my-element"></div>';
    const object = new Matreshka();
    object.bindNode('myKey', '.my-progress', Matreshka.binders.progress());
    object.bindNode('myStyle', '.my-element', Matreshka.binders.style('backgroundColor'));
    object.myKey = 42;
    object.myStyle = 'red';
    await wait();
    expect($('.my-progress').value).toBe(42);
    // background-color of .my-element is red now
    expect($('.my-element').style.backgroundColor).toBe('red');
  });

  it('DOC-8 types/matreshka.md: the sample calls calc on the instance it creates', () => {
    const matreshka = new Matreshka();
    matreshka.b = 1;
    expect(matreshka.calc('a', 'b')).toBe(matreshka);
    expect(matreshka.a).toBe(1);
  });

  it('DOC-9 to-json.md: a nested Matreshka.Array', () => {
    const matreshkaArray = new Matreshka.Array(1, 2, new Matreshka.Array(3, 4));
    // returns [1, 2, [3, 4]]
    expect(matreshkaArray.toJSON()).toEqual([1, 2, [3, 4]]);
    // returns [1, 2, MatreshkaArray]
    expect(matreshkaArray.toJSON(false)[2].isMatreshkaArray).toBe(true);
  });
});
