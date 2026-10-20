// The legacy check: ES5 only, so it runs as is in IE 11 (test/legacy/index.html) and in check-legacy-run.mjs, which
// loads dist/matreshka.min.js into a page without the APIs IE 11 lacks. Each case calls done() or throws.
(function () {
  var M = window.Matreshka;
  var binders = M.binders;
  var cases = [];
  var test = function (name, fn) {
    cases.push({ name: name, fn: fn });
  };
  var equal = function (actual, expected, what) {
    if (actual !== expected) {
      throw new Error(what + ': expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
    }
  };
  // the case that runs now; an error in a later step fails it
  var current;
  // hops through timers before the wait, so a debounced step that schedules the next one is done on a busy machine too
  var later = function (fn) {
    var owner = current;
    var hops = 5;
    var hop = function () {
      if (hops--) return setTimeout(hop, 0);
      setTimeout(function () {
        try {
          fn();
        } catch (error) {
          owner.finish(error);
        }
      }, 20);
    };
    hop();
  };
  var root = document.getElementById('legacy-root');
  var html = function (markup) {
    root.innerHTML = markup;
    return root;
  };
  var $ = function (selector) {
    return root.querySelector(selector);
  };
  var fire = function (node, name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    node.dispatchEvent(event);
  };

  test('bindNode: an input and a property, both ways', function (done) {
    html('<input class="name" value="Ann"><span class="out"></span>');
    var app = {};
    M.bindNode(app, 'name', '.name');
    M.bindNode(app, 'name', '.out', binders.text());
    equal(app.name, 'Ann', 'value read at bind');
    equal($('.out').textContent, 'Ann', 'text at bind');
    $('.name').value = 'Bob';
    fire($('.name'), 'input');
    later(function () {
      equal(app.name, 'Bob', 'property after input');
      equal($('.out').textContent, 'Bob', 'text after input');
      app.name = 'Cid';
      later(function () {
        equal($('.name').value, 'Cid', 'input after write');
        done();
      });
    });
  });

  test('checkbox, select multiple, textarea', function (done) {
    html(
      '<input type="checkbox" class="c"><select class="s" multiple><option value="a">a</option>' +
        '<option value="b">b</option><option value="c">c</option></select><textarea class="t"></textarea>'
    );
    var app = { values: ['a', 'c'] };
    M.bindNode(app, 'checked', '.c');
    M.bindNode(app, 'values', '.s');
    M.bindNode(app, 'text', '.t');
    equal(app.checked, false, 'checkbox read');
    $('.c').checked = true;
    fire($('.c'), 'click');
    equal($('.s').options[0].selected && !$('.s').options[1].selected && $('.s').options[2].selected, true, 'select');
    $('.t').value = 'hello';
    fire($('.t'), 'input');
    later(function () {
      equal(app.checked, true, 'checkbox after click');
      equal(app.text, 'hello', 'textarea');
      done();
    });
  });

  test('calc, mediate, set options, events', function (done) {
    var app = { a: 1, b: 2 };
    var log = [];
    M.calc(app, 'sum', ['a', 'b'], function (a, b) {
      return a + b;
    });
    equal(app.sum, 3, 'calc at once');
    M.mediate(app, 'n', Number);
    app.n = '42';
    equal(app.n, 42, 'mediate');
    M.on(app, 'change:a', function (evt) {
      log.push(evt.value + ':' + evt.custom);
    });
    M.set(app, 'a', 10, { custom: 'x' });
    app.a = 10;
    M.set(app, 'a', 10, { force: true, custom: 'y' });
    equal(log.join(','), '10:x,10:y', 'change events');
    var count = 0;
    var handler = function () {
      count++;
    };
    M.once(app, 'ping', handler);
    M.trigger(app, 'ping');
    M.trigger(app, 'ping');
    M.on(app, 'pong', handler);
    M.off(app, 'pong', handler);
    M.trigger(app, 'pong');
    equal(count, 1, 'once and off');
    later(function () {
      equal(app.sum, 12, 'calc later');
      done();
    });
  });

  test('delegated events through paths and arrays', function () {
    var app = { user: { address: { city: 'A' } } };
    var log = [];
    M.on(app, 'user.address@change:city', function (evt) {
      log.push(evt.value);
    });
    app.user.address.city = 'B';
    app.user = { address: { city: 'C' } };
    app.user.address.city = 'D';
    equal(log.join(','), 'B,D', 'path listener follows the new object');
    var list = new M.Array();
    var seen = [];
    list.on('*@change:x', function (evt) {
      seen.push(evt.value);
    });
    list.push({ x: 1 });
    list[0].x = 2;
    equal(seen.join(','), '2', 'array item listener');
  });

  test('DOM events: click::key and delegated selector', function () {
    html('<div class="box"><button class="go">go</button></div>');
    var app = {};
    var log = [];
    M.bindNode(app, 'box', '.box', { on: null, getValue: null, setValue: null });
    M.on(app, 'click::box(.go)', function () {
      log.push('delegated');
    });
    M.on(app, 'click::box', function () {
      log.push('direct');
    });
    fire($('.go'), 'click');
    equal(log.join(','), 'delegated,direct', 'click handlers');
  });

  test('binders: className, display, existence, attr, prop, html, style, dataset', function (done) {
    html(
      '<div class="w"><p id="e" class="one two">x</p></div><b class="k"></b><a class="l"></a>' +
        '<input class="p"><i class="h"></i><u class="st"></u><s class="d"></s>'
    );
    var app = { on: true, visible: false, exists: false, href: '/x', disabled: true, markup: '<em>hi</em>' };
    app.color = 'red';
    app.id = '7';
    M.bindNode(app, 'on', '.k', binders.className('active'));
    M.bindNode(app, 'visible', '.l', binders.display());
    M.bindNode(app, 'exists', '#e', binders.existence());
    M.bindNode(app, 'href', '.l', binders.attr('href'));
    M.bindNode(app, 'disabled', '.p', binders.prop('disabled'));
    M.bindNode(app, 'markup', '.h', binders.html());
    M.bindNode(app, 'color', '.st', binders.style('color'));
    M.bindNode(app, 'id', '.d', binders.dataset('userId'));
    equal($('.k').className, 'k active', 'className');
    equal($('.l').style.display, 'none', 'display');
    equal($('#e'), null, 'existence removes');
    equal(root.querySelector('.w').innerHTML, '<!--P#e.one.two-->', 'existence comment');
    equal($('.l').getAttribute('href'), '/x', 'attr');
    equal($('.p').disabled, true, 'prop');
    equal($('.h').innerHTML, '<em>hi</em>', 'html');
    equal($('.st').style.color, 'red', 'style');
    equal($('.d').getAttribute('data-user-id'), '7', 'dataset');
    app.on = false;
    app.exists = true;
    later(function () {
      equal($('.k').className, 'k', 'className off');
      equal($('#e').textContent, 'x', 'existence puts back');
      done();
    });
  });

  test('parseBindings: text, attribute, two-way input', function (done) {
    html('<div class="c"><h2>Hi, {{name}}!</h2><a href="/u/{{id}}">u</a><input value="{{q}}"></div>');
    var app = { name: 'Ann', id: 5, q: 'x' };
    M.parseBindings(app, '.c');
    equal($('h2').textContent, 'Hi, Ann!', 'text');
    equal($('a').getAttribute('href'), '/u/5', 'attribute');
    equal($('input').value, 'x', 'input');
    $('input').value = 'y';
    fire($('input'), 'input');
    later(function () {
      equal(app.q, 'y', 'two-way');
      var nodes = M.parseBindings(app, '<p>{{name}}</p>');
      equal(nodes[0].textContent, 'Ann', 'HTML string');
      done();
    });
  });

  test('Matreshka.Array renders rows into a table (HTML parsed without <template>)', function (done) {
    html('<table><tbody class="rows"></tbody></table>');
    var Row = M.Class({
      extends: M.Object,
      constructor: function (data) {
        M.Object.call(this, data);
      },
      onRender: function () {
        this.bindNode('name', ':sandbox .n', binders.text());
      }
    });
    var Rows = M.Class({
      extends: M.Array,
      Model: Row,
      itemRenderer: '<tr><td class="n"></td></tr>',
      constructor: function () {
        M.Array.call(this);
        this.bindNode('sandbox', '.rows');
      }
    });
    var rows = new Rows();
    rows.push({ name: 'b' }, { name: 'a' });
    rows.unshift({ name: 'c' });
    later(function () {
      var cells = function () {
        var result = [];
        var list = root.querySelectorAll('td');
        var i;
        for (i = 0; i < list.length; i++) result.push(list[i].textContent);
        return result.join(',');
      };
      equal(cells(), 'c,b,a', 'rendered');
      equal(rows[0] instanceof Row, true, 'Model');
      rows.orderBy('name');
      equal(cells(), 'a,b,c', 'orderBy moves the rows');
      rows.splice(1, 1);
      rows.pull(0);
      equal(cells(), 'c', 'splice and pull');
      rows.recreate([{ name: 'x' }, { name: 'y' }]);
      equal(cells(), 'x,y', 'recreate');
      rows[1].name = 'z';
      later(function () {
        equal(cells(), 'x,z', 'item binding');
        equal(rows.indexOf(rows[1]), 1, 'indexOf');
        equal(
          rows
            .map(function (row) {
              return row.name;
            })
            .join(','),
          'x,z',
          'map'
        );
        equal(JSON.stringify(rows.toJSON()), '[{"name":"x"},{"name":"z"}]', 'toJSON');
        done();
      });
    });
  });

  test('Matreshka.Array: options, select and list items', function (done) {
    html('<select class="s"></select><ul class="u"></ul>');
    var options = new M.Array();
    options.itemRenderer = '<option></option>';
    options.on('*@render', function (evt) {
      evt.node.textContent = evt.self.label;
    });
    M.bindNode(options, 'sandbox', '.s');
    options.push({ label: 'one' }, { label: 'two' });
    var items = new M.Array();
    items.itemRenderer = function () {
      return '<li>{{t}}</li>';
    };
    M.bindNode(items, 'sandbox', '.u');
    items.push({ t: 'p' });
    later(function () {
      equal($('.s').options.length, 2, 'options rendered');
      equal($('.s').options[1].textContent, 'two', 'option text');
      equal($('.u').textContent, 'p', 'li');
      done();
    });
  });

  test('Matreshka.Object: data keys, setData, entries, toJSON', function () {
    var obj = new M.Object({ a: 1, b: 2 });
    var log = [];
    obj.on('set', function (evt) {
      log.push(evt.key);
    });
    obj.setData({ c: 3 });
    obj.setData({ a: 5 }, { replaceData: true });
    equal(obj.keys().join(','), 'a', 'keys');
    equal(JSON.stringify(obj.entries()), '[["a",5]]', 'entries');
    equal(JSON.stringify(obj.toJSON()), '{"a":5}', 'toJSON');
    equal(obj.isDataKey('a') && !obj.isDataKey('b'), true, 'isDataKey');
    equal(log.join(','), 'c,a', 'set events');
    var copy = new M.Object();
    copy.setData(obj);
    equal(JSON.stringify(copy.toJSON()), '{"a":5}', 'setData from an instance');
  });

  test('Class: inheritance, statics, instanceof, calling the parent', function () {
    var A = M.Class(
      {
        constructor: function (x) {
          this.x = x;
        },
        hello: function () {
          return 'A' + this.x;
        }
      },
      { make: 'yes' }
    );
    var B = M.Class({ extends: A });
    var C = M.Class({
      extends: B,
      constructor: function (x) {
        B.call(this, x);
        this.c = true;
      },
      hello: function () {
        return A.prototype.hello.call(this) + 'C';
      }
    });
    var c = new C(1);
    equal(c.hello(), 'A1C', 'method');
    equal(c instanceof A && c instanceof C, true, 'instanceof');
    equal(C.make, 'yes', 'static inherited');
    var key;
    var keys = [];
    for (key in C) keys.push(key);
    equal(keys.join(','), 'make', 'statics only');
    var Widget = M.Class({
      extends: M,
      constructor: function () {
        M.call(this);
        this.bindNode('v', document.createElement('input'));
      }
    });
    equal(new Widget().isMatreshka, true, 'extends Matreshka');
  });

  test('instantiate, toMatreshka, remove', function () {
    var Point = M.Class({ extends: M.Object });
    var app = {};
    M.instantiate(app, 'point', Point);
    app.point = { x: 1 };
    equal(app.point instanceof Point, true, 'instantiate');
    var tree = M.toMatreshka({ a: [1, { b: 2 }] });
    equal(tree.a.isMatreshkaArray && tree.a[1].isMatreshkaObject, true, 'toMatreshka');
    var removed = [];
    M.on(app, 'delete:point', function () {
      removed.push('point');
    });
    M.remove(app, 'point');
    equal(removed.join(','), 'point', 'remove');
    equal('point' in app, false, 'removed key');
  });

  test('parseForm: fields to properties', function (done) {
    html(
      '<form class="f"><input name="email" value="a@b.c"><input type="checkbox" name="agree">' +
        '<input type="radio" name="plan" value="x" checked><input type="radio" name="plan" value="y">' +
        '<select name="size"><option value="s">s</option><option value="m" selected>m</option></select></form>'
    );
    var form = {};
    M.parseForm(form, '.f');
    equal(form.email, 'a@b.c', 'text field');
    equal(form.agree, false, 'checkbox');
    equal(form.plan, 'x', 'radio');
    equal(form.size, 'm', 'select');
    form.plan = 'y';
    later(function () {
      equal(root.querySelectorAll('input[type=radio]')[1].checked, true, 'radio written');
      done();
    });
  });

  test('hash router', function (done) {
    var app = {};
    location.hash = '#!/users/42/';
    // the hashchange of that write comes first
    later(function () {
      M.initRouter(app, '/section/id/');
      equal(app.section, 'users', 'section from the URL');
      equal(app.id, '42', 'id from the URL');
      app.id = '7';
      later(function () {
        equal(location.hash, '#!/users/7/', 'URL from the keys');
        app.section = null;
        later(function () {
          equal(M.Router.hash.path, '/', 'cut');
          done();
        });
      });
    });
  });

  test('a method the browser lacks is left out, as on a native array', function () {
    var list = new M.Array(1, 2, 3);
    equal(typeof list.includes, typeof [].includes, 'includes');
    equal(typeof list.find, typeof [].find, 'find');
    equal(list.join('-'), '1-2-3', 'join');
    equal(list.fill(0, 1).join('-'), '1-0-0', 'fill is its own');
  });

  test('<col> items, Array.from holes, a primitive in instantiate, String(value) in text', function (done) {
    html('<table><colgroup class="g"></colgroup></table><span class="m"></span>');
    var cols = new M.Array();
    cols.itemRenderer = '<col>';
    M.bindNode(cols, 'container', '.g');
    cols.push({}, {});
    equal($('.g').getElementsByTagName('col').length, 2, 'cols rendered');
    equal(
      M.Array.from({ length: 3 }, function (_, i) {
        return i * 2;
      }).join(),
      '0,2,4',
      'Array.from range'
    );
    var Point = function (data) {
      this.d = data;
    };
    var app = {};
    M.instantiate(app, 'p', Point);
    app.p = { a: 1 };
    app.p = 5;
    equal(app.p.a, 1, 'instantiate keeps the instance');
    var price = {
      valueOf: function () {
        return 42;
      },
      toString: function () {
        return '$42.00';
      }
    };
    M.bindNode(app, 'price', '.m', binders.text());
    app.price = price;
    later(function () {
      equal($('.m').textContent, '$42.00', 'text shows toString');
      done();
    });
  });

  // runs the cases in order; window.legacyResult holds { passed, failed: [message] } when all are done
  var failed = [];
  var passed = 0;
  var report = document.getElementById('legacy-report');
  var next = function (index) {
    if (index === cases.length) {
      window.legacyResult = { passed: passed, failed: failed };
      if (report) {
        report.textContent =
          passed + ' of ' + cases.length + ' passed' + (failed.length ? '\n' + failed.join('\n') : '');
      }
      return;
    }
    var item = cases[index];
    var finished = false;
    var finish = function (error) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (error) failed.push(item.name + ': ' + (error.message || error));
      else passed++;
      root.innerHTML = '';
      setTimeout(function () {
        next(index + 1);
      }, 0);
    };
    var timer = setTimeout(function () {
      finish(new Error('timed out'));
    }, 2000);
    current = { finish: finish };
    try {
      if (item.fn.length) {
        item.fn(function () {
          finish();
        });
      } else {
        item.fn();
        finish();
      }
    } catch (error) {
      finish(error);
    }
  };
  window.onerror = function (message) {
    if (current) current.finish(new Error('uncaught: ' + message));
  };
  next(0);
})();
