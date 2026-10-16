---
title: "Matreshka.Object#entries"
sidebarTitle: "entries"
description: "Matreshka.Object#entries: Возвращает массив пар имен и значений свойств, отвечающих за данные"
importance: 3
---

# Matreshka.Object#entries

**Метод** · Начиная с версии 2.0.0

```js
Matreshka.Object#entries() → array
```

Возвращает массив пар имен и значений свойств, отвечающих за данные

**Возвращает:** [`array`](/ru/api/types/array/) – entries

## Примеры

```js
for(const [key, value] of this.entries()) {
    console.log(key, value);
}
```
