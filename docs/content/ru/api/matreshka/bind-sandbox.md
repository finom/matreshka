---
title: "Matreshka#bindSandbox"
sidebarTitle: "bindSandbox"
description: "Matreshka#bindSandbox: Привязывает песочницу. Matreshka.js справочник API"
importance: 3
---

# Matreshka#bindSandbox

**Метод** · Начиная с версии 1.5

```js
Matreshka#bindSandbox(node, [eventOptions])
```

Привязывает песочницу

При этом, "отвязывает" предыдущую, если таковая существует.
> У метода есть [статичный аналог](/ru/api/matreshka-static/bind-sandbox/).

Ключ ``sandbox`` зарезервирован для привязки: он не попадает в ``Object.keys`` и ``JSON.stringify``, а чтение или присваивание ``this.sandbox`` бросает ошибку. Привязанный узел доступен как ``this.nodes.sandbox``.

**Генерирует события:** `bind`, `bind:sandbox`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `node` | [`string`](/ru/api/types/string/) \| [`node`](/ru/api/types/node/) \| [`$nodes`](/ru/api/types/dollar-nodes/) | Элемент, который должен стать песочницей |
| `eventOptions` (необязательный) | [`eventOptions`](/ru/api/types/event-options/) | Объект события |

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)

## Примеры

```js
this.bindSandbox('.my-element');
```
