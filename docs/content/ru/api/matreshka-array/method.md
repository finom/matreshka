---
title: "Matreshka.Array#METHOD"
sidebarTitle: "METHOD"
description: "Matreshka.Array#METHOD: Любой метод из Array.prototype"
importance: 1
---

# Matreshka.Array#METHOD

**Метод**

```js
Matreshka.Array#METHOD()
```

Любой метод из ``Array.prototype``

[`Matreshka.Array`](/ru/api/matreshka-array/) включает в себя все методы, входящие в нативный JavaScript массив:

- [join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
- [pop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
- [push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
- [reverse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
- [shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
- [unshift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
- [slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
- [splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [indexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
- [lastIndexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)
- [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [reduceRight](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
- [copyWithin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)
- [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
- [fill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)
- [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- [entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries)
- [keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)
- [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)

При этом, они работают точно так же, как и методы ``Array.prototype``. Есть лишь несколько оговорок:
- Метод ``forEach`` возвращает себя вместо ``undefined``
- Методы, которые в оригинальном виде возвращают новый массив (``splice``, ``slice``, ``filter``, ``map``...), возвращают новый экземпляр ``Matreshka.Array``.
- Методы ``keys``, ``values`` и ``entries`` возвращают массив вместо итератора.
- ``fill`` передаёт заменённые элементы как ``removed`` в события ``remove`` и ``modify``, а ``added`` содержит по одному элементу на каждый заполненный индекс.
- ``fill`` и ``copyWithin`` бросают ошибку на отрендеренном массиве (у которого есть ``container`` или ``sandbox``) и не меняют его.

Кроме всего, методы генерируют события связанные с любой модификацией массива. Подробнее см. [`Matreshka.Array`](/ru/api/matreshka-array/).

## Ссылки

- [`Matreshka.Array#METHOD_`](/ru/api/matreshka-array/method-silent/)

## Примеры

```js
this.push(1, 2, 3);
```

```js
const matreshkaArray = this
	.forEach((value, index) => {
		//...
	})
	.map((value, index) => {
		//...
	});

console.log(matreshkaArray.isMatreshkaArray); // true
```

```js
this.reverse();
```
