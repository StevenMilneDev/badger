import descriptionResolver from "./descriptionResolver"
import { warning } from '@actions/core'

jest.mock('@actions/core')

interface MockContext {
  body: string
}

const makeContext = ({ body = '' }: Partial<MockContext> = {}) => ({
  payload: {
    pull_request: { body }
  }
}) as any

const badger = (lines: string[]) => `
---
## 🦡 Badger

${lines.join('\n')}
---
`

it('should return undefined if no badger section', () => {
  const context = makeContext()
  const resolver = descriptionResolver(context)

  expect(resolver('test')).toBe(undefined)
  expect(warning).toHaveBeenCalledWith('Could not find 🦡 Badger section in description')
})

it('should return undefined if no field exists with given name', () => {
  const body = badger([`Test: value`])
  const context = makeContext({ body })
  const resolver = descriptionResolver(context)

  expect(resolver('thing')).toBe(undefined)
})

it('should return value from badger section of PR description', () => {
  const value = 'value'
  const body = badger([`Test: ${value}`])
  const context = makeContext({ body })
  const resolver = descriptionResolver(context)

  expect(resolver('test')).toBe(value)
})

it('should ignore whitespace', () => {
  const value = 'value'
  const body = badger([`Test:${value}     `])
  const context = makeContext({ body })
  const resolver = descriptionResolver(context)

  expect(resolver('test')).toBe(value)
})