const test = require('ava')
const getIterator = require('./')

test('should get iterator for Symbol.iterator', t => {
  const input = [1, 2, 3]
  const iterable = {
    [Symbol.iterator]: () => {
      let i = 0
      return {
        next: () => {
          const value = input[i++]
          return { done: !value, value }
        }
      }
    }
  }
  const it = getIterator(iterable)
  const output = []
  while (true) {
    const { done, value } = it.next()
    if (done) break
    output.push(value)
  }
  t.deepEqual(output, input)
})

test('should get iterator for Symbol.asyncIterator', async t => {
  const input = [1, 2, 3]
  const iterable = {
    [Symbol.asyncIterator]: () => {
      let i = 0
      return {
        next: async () => {
          const value = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(input[i++]), 10)
          })
          return { done: !value, value }
        }
      }
    }
  }
  const it = getIterator(iterable)
  const output = []
  while (true) {
    const { done, value } = await it.next()
    if (done) break
    output.push(value)
  }
  t.deepEqual(output, input)
})

test('should get iterator for iterator', t => {
  const input = [1, 2, 3]
  const iterator = (() => {
    let i = 0
    return {
      next: () => {
        const value = input[i++]
        return { done: !value, value }
      }
    }
  })()
  const it = getIterator(iterator)
  t.is(it, iterator)
  const output = []
  while (true) {
    const { done, value } = it.next()
    if (done) break
    output.push(value)
  }
  t.deepEqual(output, input)
})

test('should get iterator for async iterator', async t => {
  const input = [1, 2, 3]
  const iterator = (() => {
    let i = 0
    return {
      next: async () => {
        const value = await new Promise((resolve, reject) => {
          setTimeout(() => resolve(input[i++]), 10)
        })
        return { done: !value, value }
      }
    }
  })()
  const it = getIterator(iterator)
  t.is(it, iterator)
  const output = []
  while (true) {
    const { done, value } = await it.next()
    if (done) break
    output.push(value)
  }
  t.deepEqual(output, input)
})

test('should throw for non iterable or iterator', t => {
  const error = t.throws(() => getIterator())
  t.is(error.message, 'argument is not an iterator or iterable')
})
