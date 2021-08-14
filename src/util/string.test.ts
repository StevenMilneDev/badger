import { asEnvironmentVariableName, replaceAll } from "./string"

describe('Replace All', () => {
  it('should do nothing if the token could not be found', () => {
    const source = 'this is a {{word}} test'
    const token = '{{test}}'
    const value = 'ERROR'
   
    expect(replaceAll(source, token, value)).toEqual(source)
  })

  it('should replace all instances of the token', () => {
    const source = 'this is a {{word}} test {{word}}'
    const token = '{{word}}'
    const value = 'unit'
   
    expect(replaceAll(source, token, value)).toEqual(`this is a ${value} test ${value}`)
  })
})

describe('As Environment Variable Name', () => {
  it('should uppercase all characters', () => {
    expect(asEnvironmentVariableName('heLlo')).toBe('HELLO')
  })

  it('should convert full stops to underscores', () => {
    expect(asEnvironmentVariableName('trello.card')).toBe('TRELLO_CARD')
  })
})