import descriptionResolver from "./descriptionResolver"
import { warning } from '@actions/core'
import { BodyBuilder, makeContext } from "../util/testUtil"

jest.mock('@actions/core')

it('should return undefined if no badger section', () => {
  const context = makeContext()
  const resolver = descriptionResolver(context)

  expect(resolver('test')).toBe(undefined)
  expect(warning).toHaveBeenCalledWith('Could not find 🦡 Badger section in description')
})

it('should return undefined if no field exists with given name', () => {
  const body = new BodyBuilder('').withBadgerLines(['Test: Value']).build()
  const context = makeContext({ body })
  const resolver = descriptionResolver(context)

  expect(resolver('thing')).toBe(undefined)
})

it('should return value from badger section of PR description', () => {
  const value = 'value'
  const body = new BodyBuilder('').withBadgerLines([`Test: ${value}`]).build()
  const context = makeContext({ body })
  const resolver = descriptionResolver(context)

  expect(resolver('test')).toBe(value)
})

it('should ignore whitespace', () => {
  const value = 'value'
  const body = new BodyBuilder('').withBadgerLines([`Test:${value}      `]).build()
  const context = makeContext({ body })
  const resolver = descriptionResolver(context)

  expect(resolver('test')).toBe(value)
})