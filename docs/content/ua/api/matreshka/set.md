---
title: "Matreshka#set"
sidebarTitle: "set"
description: "Matreshka#set: Встановлює значення властивості, дозволяючи передати об'єкт події в якості третьої аргументу"
importance: 1
---

# Matreshka#set

**Метод**

```js
Matreshka#set(key, value, [eventOptions])
```

Встановлює значення властивості, дозволяючи передати об'єкт події в якості третьої аргументу

Список підтримуваних прапорів:
+ ``silent`` - не викликати події ``change`` і ``change:KEY``
+ ``silentHTML`` - не змінювати стан прив'язаних елементів
+ ``force`` - викликати події ``change`` і ``change:KEY`` навіть якщо значення властивості не змінилося
+ ``forceHTML`` - змінити стан прив'язаного елемента, навіть якщо значення властивості не змінилося. Ця опція потрібна, якщо прив'язаний елемент був відмальований після прив'язки (наприклад, в ``select`` були додані теги ``option``)
+ ``skipMediator`` - запобігає трансформацію властивості медіатором (див. [`Matreshka#mediate`](/ua/api/matreshka/mediate/))
+ ``skipCalc`` - запобігає роботу залежностей, створених за допомогою [`Matreshka#calc`](/ua/api/matreshka/calc/)

> У метода є [статичний аналог](/ua/api/matreshka-static/set/).

**Генерує події:** `change`, `change:KEY`, `beforechange`, `beforechange:KEY`

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `key` | [`string`](/ua/api/types/string/) | Ключ |
| `value` | [`*`](/ua/api/types/any/) | Значення |
| `eventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Об'єкт події |

## Приклади

```js
this.on('change: myKey', evt => {
	alert(evt.value);
});

// Те ж саме, що і this['myKey'] = 3
// або this.myKey = 3
// виводить на екран 3
this.set('myKey', 3);
```

**Використання ``eventOptions``**

```js
this.on('change:myKey', evt => {
	alert(evt.value);
});

// alert не спрацює
this.set('myKey', 4, {
	silent: true
});
```

**Передача даних в обробник**

```js
this.on('change:myKey', evt => {
	alert(evt.myCustomFlag);
});

// Виводить на екран 42
this.set('myKey', 4, {
	myCustomFlag: 42
});
```

## Альтернативний синтаксис методу Matreshka#set "ключ-значення" [#variation-2]

```js
Matreshka#set(keyValuePairs, [eventOptions])
```

### Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `keyValuePairs` | [`object`](/ua/api/types/object/) | Об'єкт, що містить пари ключ-значення |
| `eventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Об'єкт події |

### Приклади

```js
this.set({
	myKey1: 1,
	myKey2: 2
});
```

**Передача ``eventOptions`` в якості второго аргумента**

```js
this.set({
	myKey: 3
}, {
	myFlag: 'foo'
});
```
