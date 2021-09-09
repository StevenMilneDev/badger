import environmentResolver from "./environmentResolver"

beforeEach(() => {
  delete process.env.TEST
  delete process.env.TEST_THING
})

it('should return undefined for unknown names', () => {
  expect(environmentResolver('TEST')).toBe(undefined)
})

it('should return value from environment variables', () => {
  process.env.TEST = 'value'

  expect(environmentResolver('TEST')).toBe(process.env.TEST)
})

it('should transform lowercase names', () => {
  process.env.TEST = 'value'

  expect(environmentResolver('test')).toBe(process.env.TEST)
})

it('should replace full stops with underscores', () => {
  process.env.TEST_THING = 'something'

  expect(environmentResolver('test.thing')).toBe(process.env.TEST_THING)
})