---
title: "Matreshka.Array#mediateItem"
sidebarTitle: "mediateItem"
description: "Matreshka.Array#mediateItem: Трансформирует значение элементов массива"
importance: 2
---

# Matreshka.Array#mediateItem

**Метод** · Начиная с версии 0.1

```js
Matreshka.Array#mediateItem(mediator)
```

Трансформирует значение элементов массива

Этот метод служит для того, чтоб перехватить и трансформировать добавленные в массив элементы. Обратите внимание, метод переопределяет свойство [`Matreshka.Array#Model`](/ru/api/matreshka-array/model/).

Вызов метода конвертирует элементы, которые уже есть в массиве, и заменяет их отрендеренные узлы; события при этом не генерируются.

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `mediator` | [`function`](/ru/api/types/function/) | Функция, возвращающая трансформированный элемент массива |

## Ссылки

- [`Matreshka.Array#Model`](/ru/api/matreshka-array/model/)
- [`Matreshka#mediate`](/ru/api/matreshka/mediate/)

## Примеры

```js
// все элементы массива - целые числа
this.mediateItem(item => parseInt(item) || 0);
```

```js
this.push(1, 2, 3, 4, 5);

// все элементы массива - строки
this.mediateItem(String);

this.push(6, 7);

this.unshift(true, {});

// ["true", "[object Object]", "1", "2", "3", "4", "5", "6", "7"]
console.log(matreshkaArray.toJSON());
```

```js
this.mediateItem(item => {
	if(item.something) {
		return new FirstModel(item);
	} else {
		return new SecondModel(item);
	}
});
```
