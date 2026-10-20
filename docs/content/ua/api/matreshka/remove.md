---
title: "Matreshka#remove"
sidebarTitle: "remove"
description: "Matreshka#remove: Видаляє властивість. Matreshka.js довідник API"
importance: 3
---

# Matreshka#remove

**Метод**

```js
Matreshka#remove(key, [eventOptions]) → object
```

Видаляє властивість

> У метода є [статичний аналог](/ua/api/matreshka-static/remove/).

**Повертає:** [`object`](/ua/api/types/object/) – self

**Генерує події:** `delete`, `delete:KEY`

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `key` | [`string`](/ua/api/types/string/) | Им'я властивості або масив имен властивостей, які треба видалити |
| `eventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Об'ект події |

## Приклади

```js
this.remove('myKey');
this.remove(['myKey1', 'myKey2']);
```

**Використання ``eventOptions``**

```js
this.remove('myKey', {
	silent: true
});
```
