---
title: "Matreshka.Array#renderIfPossible"
sidebarTitle: "renderIfPossible"
description: "Matreshka.Array#renderIfPossible: Властивість renderIfPossible скасовує рендеринг масиву якщо має значення false"
importance: 3
---

# Matreshka.Array#renderIfPossible

**Властивість**

```js
Matreshka.Array#renderIfPossible: boolean
```

Властивість ``renderIfPossible`` скасовує рендеринг масиву якщо має значення `` false``

## Посилання

- [`Matreshka.Array#itemRenderer`](/ua/api/matreshka-array/item-renderer/)

## Приклади

```js
class MyArray extends Matreshka.Array {
    get renderIfPossible() {
        return false;
    }
    // ...
}
```
