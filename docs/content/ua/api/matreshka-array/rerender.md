---
title: "Matreshka.Array#rerender"
sidebarTitle: "rerender"
description: "Matreshka.Array#rerender: Перемальовує DOM вузли об'єктів, що входять в масив"
importance: 3
---

# Matreshka.Array#rerender

**Метод** · Починаючи з версії 0.3

```js
Matreshka.Array#rerender([eventOptions]) → matreshkaArray
```

Перемальовує DOM вузли об'єктів, що входять в масив

Цей метод заново рендерить елементи масиву в контейнері масиву. Якщо вузол, який асоційований з айтемом вже створений, метод, замість перемальовування з нуля, "перевставляє" його в контейнер масиву.

Метод може бути корисним на випадок, коли елементи додані в масив перед оголошенням контейнера.

Щоб змусити масив перемалюватися, незалежно від наявності відрендерених вузлів (наприклад, ви використовуєте кастомний шаблонізатор в ``itemRenderer``), передайте в метод об'єкт з властивістю ``forceRerender`` рівною ``true``.

**Повертає:** [`matreshkaArray`](/ua/api/types/matreshka-array/) – self

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `eventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Об'єкт події |

## Приклади

```js
this.rerender({
	forceRerender: true
});
```
