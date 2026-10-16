---
title: "Matreshka.Array#Model"
sidebarTitle: "Model"
description: "Matreshka.Array#Model: Свойство определяет класс элементов, которые будет содержать коллекция"
importance: 1
---

# Matreshka.Array#Model

**Метод** · Начиная с версии 0.2 · Определяется вами

```js
Matreshka.Array#Model(data, matreshkaArray, index)
```

Свойство определяет класс элементов, которые будет содержать коллекция

При каждом добавлении элементов в массив, встроенный обработчик проверяет, является ли добавленный элемент экземпляром ``Model`` и конвертирует его в таковой, если проверка не пройдена. Рекомендуется наследовать ``Model`` от класса [`Matreshka.Object`](/ru/api/matreshka-object/) или [`Matreshka.Array`](/ru/api/matreshka-array/) (на случай, если требуется получить коллекцию коллекций), чтоб получить возможность конвертации массива в обычный массив методом [`Matreshka.Array#toJSON`](/ru/api/matreshka-array/to-json/).

Для более гибкого контроля класса элементов (например, если для одних элементов нужно использовать одну Модель, а для других - другую), используйте [`Matreshka.Array#mediateItem`](/ru/api/matreshka-array/mediate-item/).

``Model`` можно объявить как поле класса (``Model = MyModel;``), а не только как геттер. Поля класса устанавливаются после возврата из ``super(...)``, поэтому элементы, переданные в ``super(...)``, конвертируются, когда массив в следующий раз изменяет какой-нибудь метод; геттер ``get Model()`` конвертирует их сразу.

Если изменить ``Model`` позже, элементы, которые уже есть в массиве, конвертируются, а их отрендеренные узлы заменяются.

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `data` | [`object`](/ru/api/types/object/) | Данные, переданные в конструктор |
| `matreshkaArray` | [`matreshkaArray`](/ru/api/types/matreshka-array/) | Массив, в который добавили элемент |
| `index` | [`number`](/ru/api/types/number/) | Текущий индекс объекта в родительском массиве |

## Ссылки

- [`Matreshka.Array#mediateItem`](/ru/api/matreshka-array/mediate-item/)
- [`Matreshka.Array#itemRenderer`](/ru/api/matreshka-array/item-renderer/)

## Примеры

```js
// определяем Модель
class MyModel extends Matreshka.Object {
	constructor(data, parentArray, index) {
		super(data);
		this.doSomething();
	}
	doSomething() { ... }
}

// определяем класс для коллекции
class MyArray extends Matreshka.Array {
	get Model() {
		return MyModel;
	}
}

// создаем экземпляр класса
const myArray = new MyArray();

// добавляем два элемента
myArray.push({
    a: 1,
    b: 2
}, {
    a: 3,
    b: 4
});

console.log(myArray[0] instanceof MyModel); // true
console.log(myArray[1] instanceof MyModel); // true

// вернет [{ a: 1, b: 2 }, { a: 3, b: 4 }]
myArray.toJSON();
```
