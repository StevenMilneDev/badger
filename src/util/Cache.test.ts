import Cache, { Resolver, chainedResolver, objectResolver } from './Cache'

const ITEM = 'item'
const VALUE = 'value'

it('should call the resolver on a cache miss', () => {
  const resolver = jest.fn()
  const cache = new Cache<string>(resolver)

  resolver.mockReturnValue(VALUE)

  const result = cache.get(ITEM)

  expect(resolver).toHaveBeenCalledWith(ITEM)
  expect(result).toBe(VALUE)
})

it('should only call the resolver once per item', () => {
  const resolver = jest.fn()
  const cache = new Cache<string>(resolver)

  resolver.mockReturnValue(VALUE)

  cache.get(ITEM)
  cache.get(ITEM)
  cache.get(ITEM)

  expect(resolver).toHaveBeenCalledTimes(1)
})

it('should return undefined if resolver cannot resolve', () => {
  const resolver: Resolver<string> = () => undefined
  const cache = new Cache<string>(resolver)

  expect(cache.get(ITEM)).toBe(undefined)
})

describe('Object Resolver', () => {
  it('should return properties from the object', () => {
    const obj = { [ITEM]: VALUE }
    const resolver = objectResolver(obj)
    const cache = new Cache<string>(resolver)

    expect(cache.get(ITEM)).toBe(VALUE)
    expect(cache.get('miss')).toBe(undefined)
  })
})

describe('Chained Resolver', () => {
  it('should call subsequent resolvers if values cannot be determined', () => {
    const resolver1 = jest.fn().mockReturnValue(undefined)
    const resolver2 = jest.fn().mockReturnValue(VALUE)
    const resolver3 = jest.fn().mockReturnValue(VALUE)

    const resolver = chainedResolver([resolver1, resolver2, resolver3])
    const cache = new Cache<string>(resolver)

    const result = cache.get(ITEM)

    expect(resolver1).toHaveBeenCalledWith(ITEM)
    expect(resolver2).toHaveBeenCalledWith(ITEM)
    expect(resolver3).not.toHaveBeenCalledWith(ITEM)

    expect(result).toBe(VALUE)
  })
})