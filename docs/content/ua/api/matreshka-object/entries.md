---
title: "Matreshka.Object#entries"
sidebarTitle: "entries"
description: "Matreshka.Object#entries: Повертає масив пар імен і значень властивостей, що відповідають за дані"
importance: 3
---

# Matreshka.Object#entries

**Метод**

```js
Matreshka.Object#entries() → array
```

Повертає масив пар імен і значень властивостей, що відповідають за дані

**Повертає:** [`array`](/ua/api/types/array/) – entries

## Приклади

```js
for(const [key, value] of this.entries()) {
    console.log(key, value);
}
```
