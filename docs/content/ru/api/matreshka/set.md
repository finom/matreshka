---
title: "Matreshka#set"
sidebarTitle: "set"
description: "Matreshka#set: Устанавливает значение свойства, позволяя передать объект события в качестве третьего аргумента"
importance: 1
---

# Matreshka#set

**Метод**

```js
Matreshka#set(key, value, [eventOptions])
```

Устанавливает значение свойства, позволяя передать объект события в качестве третьего аргумента

Список поддерживаемых флагов:
+ ``silent`` - не вызывать события ``change`` и ``change:KEY``
+ ``silentHTML`` - не менять состояние привязанных элементов
+ ``force`` - вызвать события ``change`` и ``change:KEY`` даже если значение свойства не изменилось
+ ``forceHTML`` - изменить состояние привязанного элемента, даже если значение свойства не изменилось. Эта опция нужна, если привязанный элемент был отрисован после привязки (например, в ``select`` были добавлены теги ``option``)
+ ``skipMediator`` - предотвращает трансформацию свойства медиатором (см. [`Matreshka#mediate`](/ru/api/matreshka/mediate/))
+ ``skipCalc`` - предотвращает работу зависимостей, созданных с помощью [`Matreshka#calc`](/ru/api/matreshka/calc/)

> У метода есть [статичный аналог](/ru/api/matreshka-static/set/).

**Генерирует события:** `change`, `change:KEY`, `beforechange`, `beforechange:KEY`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `key` | [`string`](/ru/api/types/string/) | Ключ |
| `value` | [`*`](/ru/api/types/any/) | Значение |
| `eventOptions` (необязательный) | [`eventOptions`](/ru/api/types/event-options/) | Объект события |

## Примеры

```js
this.on('change:myKey', evt => {
	alert(evt.value);
});

// то же самое, что и this['myKey'] = 3
// или this.myKey = 3
// выводит на экран 3
this.set('myKey', 3);
```

**Используя ``eventOptions``**

```js
this.on('change:myKey', evt => {
	alert(evt.value);
});

// alert не срабатывает
this.set('myKey', 4, {
	silent: true
});
```

**Передача произвольных данных в обработчик**

```js
this.on('change:myKey', evt => {
	alert(evt.myCustomFlag);
});

// выводит на экран 42
this.set('myKey', 4, {
	myCustomFlag: 42
});
```

## Альтернативный синтаксис метода Matreshka#set "ключ-значение" [#variation-2]

```js
Matreshka#set(keyValuePairs, [eventOptions])
```

### Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `keyValuePairs` | [`object`](/ru/api/types/object/) | Объект, содержащий пары ключ-значение |
| `eventOptions` (необязательный) | [`eventOptions`](/ru/api/types/event-options/) | Объект события |

### Примеры

```js
this.set({
	myKey1: 1,
	myKey2: 2
});
```

**Передача ``eventOptions`` в качестве второго аргумента**

```js
this.set({
	myKey: 3
}, {
	myFlag: 'foo'
});
```
