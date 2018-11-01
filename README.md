# get-iterator

> Get the default iterator or async iterator for an Iterable.

Reduce the boilerplate of extracting the iterator from an object when you don't know if the object is an (async) iterable or already an (async) iterator.

## Install

```sh
npm install get-iterator
```

## Usage

```js
const getIterator = require('get-iterator')
const input = [1, 2, 3]
const it = getIterator(input)
console.log(it.next()) // { done: false, value: 1 }
console.log(it.next()) // { done: false, value: 2 }
console.log(it.next()) // { done: false, value: 3 }
console.log(it.next()) // { done: true, value: undefined }
```

### Examples

Regular iterator from iterable:

```js
const getIterator = require('get-iterator')

const input = [1, 2, 3]
const iterable = {
  [Symbol.iterator] () {
    let i = 0
    return {
      next () {
        const value = input[i++]
        return { done: !value, value }
      }
    }
  }
}

const it = getIterator(input)
console.log(it.next()) // { done: false, value: 1 }
console.log(it.next()) // { done: false, value: 2 }
console.log(it.next()) // { done: false, value: 3 }
console.log(it.next()) // { done: true, value: undefined }
```

Async iterator from iterable:

```js
const getIterator = require('get-iterator')

const input = [1, 2, 3]
const iterable = {
  [Symbol.asyncIterator] () {
    let i = 0
    return {
      async next () {
        const value = await new Promise((resolve, reject) => {
          setTimeout(() => resolve(input[i++]), 10)
        })
        return { done: !value, value }
      }
    }
  }
}

const it = getIterator(iterable)
console.log(await it.next()) // { done: false, value: 1 }
console.log(await it.next()) // { done: false, value: 2 }
console.log(await it.next()) // { done: false, value: 3 }
console.log(await it.next()) // { done: true, value: undefined }
```

Already an iterator (probably):

```js
const getIterator = require('get-iterator')

const input = [1, 2, 3]
let i = 0
const iterator = {
  next () {
    const value = input[i++]
    return { done: !value, value }
  }
}

const it = getIterator(iterator)
console.log(it.next()) // { done: false, value: 1 }
console.log(it.next()) // { done: false, value: 2 }
console.log(it.next()) // { done: false, value: 3 }
console.log(it.next()) // { done: true, value: undefined }
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/abortable-iterator/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
