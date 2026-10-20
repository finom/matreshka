---
title: "Matreshka#remove"
sidebarTitle: "remove"
description: "Matreshka#remove: Удаляет свойство. Matreshka.js справочник API"
importance: 3
---

# Matreshka#remove

**Метод**

```js
Matreshka#remove(key, [eventOptions]) → object
```

Удаляет свойство

> У метода есть [статичный аналог](/ru/api/matreshka-static/remove/).

**Возвращает:** [`object`](/ru/api/types/object/) – self

**Генерирует события:** `delete`, `delete:KEY`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `key` | [`string`](/ru/api/types/string/) | Имя свойства или массив имен свойств, которые следует удалить |
| `eventOptions` (необязательный) | [`eventOptions`](/ru/api/types/event-options/) | Объект события |

## Примеры

```js
this.remove('myKey');
this.remove(['myKey1', 'myKey2']);
```

**Использование ``eventOptions``**

```js
this.remove('myKey', {
	silent: true
});
```
