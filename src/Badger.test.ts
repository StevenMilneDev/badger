import { warning, info } from '@actions/core'
import Badger from "./Badger"
import Badge from "./util/badge"
import Cache, { objectResolver } from "./util/Cache"

jest.mock('@actions/core')

const EMPTY_CACHE = new Cache<string>(() => undefined)
const TEST_BODY = `
---
## 🦡 Badger
---

This is a test body!`

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Prefix', () => {
  it('should return body if no prefix provided', () => {
    const badger = new Badger(EMPTY_CACHE)

    const body = 'body'

    expect(badger.applyPrefix(body, undefined)).toBe(body)
    expect(info).not.toHaveBeenCalled()
  })

  it('should return prefixed body', () => {
    const badger = new Badger(EMPTY_CACHE)

    const prefix = 'prefix'
    const body = 'body'

    expect(badger.applyPrefix(body, prefix)).toBe(`${prefix}\n\n${body}`)
    expect(info).toHaveBeenCalledWith('Adding prefix...')
  })

  it('should resolve variables in the prefix', () => {
    const cache = new Cache<string>(objectResolver({ test: 'value' }))
    const badger = new Badger(cache)

    const prefix = 'prefix with {{test}}'
    const body = 'body'

    expect(badger.applyPrefix(body, prefix)).toBe(`prefix with value\n\n${body}`)
  })

  it('should not resolve variables in the body', () => {
    const cache = new Cache<string>(objectResolver({ test: 'value' }))
    const badger = new Badger(cache)

    const prefix = 'prefix'
    const body = 'body with {{test}}'

    expect(badger.applyPrefix(body, prefix)).toBe(`${prefix}\n\n${body}`)
  })

  it('should return body if variable resolution fails', () => {
    const cache = new Cache<string>(objectResolver({ test: 'value' }))
    const badger = new Badger(cache)

    const prefix = 'prefix with {{something}}'
    const body = 'body'

    expect(badger.applyPrefix(body, prefix)).toBe(body)
    expect(warning).toHaveBeenCalledWith('Skipping prefix: Could not resolve variable {{something}}')
  })
})

describe('Suffix', () => {
  it('should return body if no suffix provided', () => {
    const badger = new Badger(EMPTY_CACHE)

    const body = 'body'

    expect(badger.applySuffix(body, undefined)).toBe(body)
    expect(info).not.toHaveBeenCalled()
  })

  it('should return suffixed body', () => {
    const badger = new Badger(EMPTY_CACHE)

    const body = 'body'
    const suffix = 'suffix'

    expect(badger.applySuffix(body, suffix)).toBe(`${body}\n\n${suffix}`)
    expect(info).toHaveBeenCalledWith('Adding suffix...')
  })

  it('should resolve variables in the suffix', () => {
    const cache = new Cache<string>(objectResolver({ test: 'value' }))
    const badger = new Badger(cache)

    const body = 'body'
    const suffix = 'suffix with {{test}}'

    expect(badger.applySuffix(body, suffix)).toBe(`${body}\n\nsuffix with value`)
  })

  it('should not resolve variables in the body', () => {
    const cache = new Cache<string>(objectResolver({ test: 'value' }))
    const badger = new Badger(cache)

    const body = 'body with {{test}}'
    const suffix = 'suffix'

    expect(badger.applySuffix(body, suffix)).toBe(`${body}\n\n${suffix}`)
  })

  it('should return body if variable resolution fails', () => {
    const cache = new Cache<string>(objectResolver({ test: 'value' }))
    const badger = new Badger(cache)

    const body = 'body'
    const suffix = 'suffix with {{something}}'

    expect(badger.applySuffix(body, suffix)).toBe(body)
    expect(warning).toHaveBeenCalledWith('Skipping suffix: Could not resolve variable {{something}}')
  })
})

describe('Badges', () => {
  it('should ignore undefined badges', () => {
    const badger = new Badger(EMPTY_CACHE)

    const result = badger.badges([undefined, undefined, undefined])

    expect(result.length).toBe(0)
  })

  it('should return badge instances', () => {
    const badger = new Badger(EMPTY_CACHE)
    const configs = [
      'Test 1: Value 2',
      'Test 2: Value 2'
    ]

    const badges = badger.badges(configs)

    expect(badges[0].toString()).toBe(configs[0])
    expect(badges[1].toString()).toBe(configs[1])
  })

  it('should resolve variables in badge configuration', () => {
    const cache = new Cache<string>(objectResolver({ test: 'value' }))
    const badger = new Badger(cache)

    const [ badge ] = badger.badges(['Test: {{test}}'])

    expect(badge.name).toBe('Test')
    expect(badge.value).toBe('value')
  })
  
  it('should log a warning if variable resolution fails', () => {
    const badger = new Badger(EMPTY_CACHE)

    const badges = badger.badges(['Test: {{test}}'])

    expect(badges.length).toBe(0)
    expect(warning).toHaveBeenCalledWith('Skipping badge-01: Could not resolve variable {{test}}')
  })

  it('should log a warning if badge parsing fails', () => {
    const badger = new Badger(EMPTY_CACHE)

    const badges = badger.badges(['hello world, this isnt a badge...'])

    expect(badges.length).toBe(0)
    expect(warning).toHaveBeenCalledWith('Skipping badge-01: Invalid badge configuration "hello world, this isnt a badge..."')
  })
})

describe('Resolve', () => {
  it('should resolve variables from the provided cache', () => {
    const resolver = jest.fn().mockReturnValue('value')
    const cache = new Cache<string>(resolver)
    const badger = new Badger(cache)

    const result = badger.resolve('Test: {{item}}')
    expect(resolver).toHaveBeenCalledWith('item')
    expect(result).toEqual('Test: value')
  })

  it('should throw an error if a variable name cannot be found in the cache', () => {
    const badger = new Badger(EMPTY_CACHE)

    expect(() => badger.resolve('Test: {{whoops}}')).toThrow('Could not resolve variable {{whoops}}');
  })
})

describe('To Markdown', () => {
  it('should enclose badges in separators', () => {
    const badger = new Badger(EMPTY_CACHE)

    expect(badger.toMarkdown([])).toBe('<!-- Start of Badger Additions -->\n\n<!-- End of Badger Additions -->')
  })

  it('should convert badges to Markdown', () => {
    const badger = new Badger(EMPTY_CACHE)
    const badges = [
      new Badge('Test 1', 'Value 1'),
      new Badge('Test 2', 'Value 2')
    ]

    const result = badger.toMarkdown(badges)
    const expected = `${badges[0].toMarkdown()} ${badges[1].toMarkdown()}`

    expect(result).toContain(expected)
  })
})

describe('Apply', () => {
  it('should prefix the content', () => {
    const badger = new Badger(EMPTY_CACHE)
    const body = 'This is body text'
    const prefix = 'I am a prefix!'

    const result = badger.apply(body, [], prefix)
    expect(result).toBe(`${prefix}\n\n${body}`)
  })

  it('should replace badger section with badges', () => {
    const badger = new Badger(EMPTY_CACHE)
    const badges = ['Test Badge: Value 1']
    
    const result = badger.apply(TEST_BODY, badges)
    expect(result).toEqual(`
<!-- Start of Badger Additions -->
![Test Badge: Value 1](https://img.shields.io/static/v1?label=Test%20Badge&message=Value%201)
<!-- End of Badger Additions -->

This is a test body!`)
  })

  it('should suffix the content', () => {
    const badger = new Badger(EMPTY_CACHE)
    const body = 'This is body text'
    const suffix = 'I am a suffix!'

    const result = badger.apply(body, [], undefined, suffix)
    expect(result).toBe(`${body}\n\n${suffix}`)
  })

  it('should apply all transformations to the content', () => {
    const badger = new Badger(EMPTY_CACHE)
    const badges = ['Test Badge: Value 1']
    const prefix = 'I am a prefix!'
    const suffix = 'I am a suffix!'

    const result = badger.apply(TEST_BODY, badges, prefix, suffix)
    expect(result).toEqual(`I am a prefix!


<!-- Start of Badger Additions -->
![Test Badge: Value 1](https://img.shields.io/static/v1?label=Test%20Badge&message=Value%201)
<!-- End of Badger Additions -->

This is a test body!

I am a suffix!`)
  })
})
