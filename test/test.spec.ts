import { expect } from 'aegir/utils/chai.js'
import { getIterator } from '../src/index.js'

describe('get-iterator', () => {
  it('should get iterator for Symbol.iterator', async () => {
    const input = [1, 2, 3]
    const iterable = {
      [Symbol.iterator]: () => {
        let i = 0
        return {
          next: () => {
            const value = input[i++]
            return { done: value == null, value }
          }
        }
      }
    }
    const it = getIterator<number>(iterable)
    const output = []
    while (true) {
      const { done, value } = await it.next()
      if (done === true) break
      output.push(value)
    }
    expect(output).to.deep.equal(input)
  })

  it('should get iterator for Symbol.asyncIterator', async () => {
    const input = [1, 2, 3]
    const iterable = {
      [Symbol.asyncIterator]: () => {
        let i = 0
        return {
          next: async () => {
            const value = await new Promise((resolve, reject) => {
              setTimeout(() => resolve(input[i++]), 10)
            })
            return { done: value == null, value }
          }
        }
      }
    }
    const it = getIterator(iterable)
    const output = []
    while (true) {
      const { done, value } = await it.next()
      if (done === true) break
      output.push(value)
    }
    expect(output).to.deep.equal(input)
  })

  it('should get iterator for iterator', async () => {
    const input = [1, 2, 3]
    const iterator = (() => {
      let i = 0
      return {
        next: () => {
          const value = input[i++]
          return { done: value == null, value }
        }
      }
    })()
    const it = getIterator(iterator)
    expect(it).to.equal(iterator)
    const output = []
    while (true) {
      const { done, value } = await it.next()
      if (done === true) break
      output.push(value)
    }
    expect(output).to.deep.equal(input)
  })

  it('should get iterator for async iterator', async () => {
    const input = [1, 2, 3]
    const iterator = (() => {
      let i = 0
      return {
        next: async () => {
          const value = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(input[i++]), 10)
          })
          return { done: value == null, value }
        }
      }
    })()
    const it = getIterator(iterator)
    expect(it).to.equal(iterator)
    const output = []
    while (true) {
      const { done, value } = await it.next()
      if (done === true) break
      output.push(value)
    }
    expect(output).to.deep.equal(input)
  })

  it('should throw for non iterable or iterator', () => {
    // @ts-expect-error invalid args
    expect(() => getIterator()).to.throw().and.to.have.property('message', 'argument is not an iterator or iterable')
  })
})
