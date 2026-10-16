---
title: "Matreshka.Object#removeDataKeys"
sidebarTitle: "removeDataKeys"
description: "Matreshka.Object#removeDataKeys: Видаляє задані імена властивостей зі списку імен властивостей, що відповідають за дані (але не видаляє властивість)"
importance: 2
---

# Matreshka.Object#removeDataKeys

**Метод**

```js
Matreshka.Object#removeDataKeys(keys) → matreshkaObject
```

Видаляє задані імена властивостей зі списку імен властивостей, що відповідають за дані (але не видаляє властивість)

Подія ``remove`` генерується раніше за ``modify``, як і в [`Matreshka#remove`](/ua/api/matreshka/remove/).

**Повертає:** [`matreshkaObject`](/ua/api/types/matreshka-object/) – self

**Генерує події:** `remove`, `modify`

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `keys` | [`string`](/ua/api/types/string/) \| [`array`](/ua/api/types/array/) | Масив імен властивостей або список аргументів з іменами властивостей |

## Приклади

```js
this.removeDataKeys(['a', 'b']);
```

```js
this.removeDataKeys('a', 'b');
```
