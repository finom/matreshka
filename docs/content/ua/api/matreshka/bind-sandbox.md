---
title: "Matreshka#bindSandbox"
sidebarTitle: "bindSandbox"
description: "Matreshka#bindSandbox: Прив'язує пісочницю. Matreshka.js довідник API"
importance: 3
---

# Matreshka#bindSandbox

**Метод**

```js
Matreshka#bindSandbox(node, [eventOptions])
```

Прив'язує пісочницю

При цьому, "одв'язує" попередню, якщо така існує.
> У метода є [статичний аналог](/ua/api/matreshka-static/bind-sandbox/).

Ключ ``sandbox`` зарезервований для прив'язки: він не потрапляє в ``Object.keys`` і ``JSON.stringify``, а читання або присвоєння ``this.sandbox`` кидає помилку. Прив'язаний вузол доступний як ``this.nodes.sandbox``.

**Генерує події:** `bind`, `bind:sandbox`

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `node` | [`string`](/ua/api/types/string/) \| [`node`](/ua/api/types/node/) \| [`$nodes`](/ua/api/types/dollar-nodes/) | Елемент, який повинен стати пісочницею |
| `eventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Об'єкт події |

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)

## Приклади

```js
this.bindSandbox('.my-element');
```
