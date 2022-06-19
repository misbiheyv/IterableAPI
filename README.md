# IterableAPI

### Небольшой API для комфротной и более производительной работы с iterable объектами

Все методы реализованы на генераторах, что обеспечивает большой прирост производительности на больших объемах данных, за счет ленивости итераторов  
  
Наверное, главным плюсом является возможность выстраивать цепочки методов, которые будут отработаны также лениво  
  
Также, не менее важным плюсом является то, что использование итераторов позволяет реализовать универсальный интерфейс для итерабл объектов, что делает код намного более полиморфным  

### map and filter  
Очень схожи Array.prototype.map и Array.prototype.filter

```ts

const iter = new Iter([1, 2, 3, 4, 5, 6]) // Может быть любая итерируемая структура (включающая [Symbol.Iterator] )

const filterRes = iter.filter((el) => el%2) // returns new Iter({ iter: Generator<any, void, unknown> })
...filterRes // 2, 4, 6

const mapRes = iter.map((el) => el + 10) // returns new Iter({ iter: Generator<any, void, unknown> })
...mapRes // 11, 12, ..., 16

```


Iter содержит 2 специфических метода:

### take  
Совершает только заданное количество итераций

```ts
const iter = new Iter([1, 2, 3])

const takeRes = iter.take(2) // returns new Iter({ iter: Generator<any, void, unknown> })
...takeRes // 1, 2
```

### enumerate  
Возвращает кортеж из значений: [index, value]

```ts
const iter = new Iter([1, 2, 3])

const enumerateRes = iter.enumerate(2) // returns new Iter({ iter: Generator<any[], void, unknown> })
...enumerateRes // [0, 1], [1, 2], [2, 3]
```
