---
title: "Matreshka.Array#renderIfPossible"
sidebarTitle: "renderIfPossible"
description: "Matreshka.Array#renderIfPossible: Свойство renderIfPossible отменяет рендеринг массива если имеет значение false"
importance: 3
---

# Matreshka.Array#renderIfPossible

**Свойство**

```js
Matreshka.Array#renderIfPossible: boolean
```

Свойство ``renderIfPossible`` отменяет рендеринг массива если имеет значение ``false``

## Ссылки

- [`Matreshka.Array#itemRenderer`](/ru/api/matreshka-array/item-renderer/)

## Примеры

```js
class MyArray extends Matreshka.Array {
    get renderIfPossible() {
        return false;
    }
    // ...
}
```
