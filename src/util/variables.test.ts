import { findReferences } from "./variables"

describe('Find References', () => {
  it('should return an empty array if no references found', () => {
    expect(findReferences('this is a test string')).toEqual([])
  })

  it('should return an array of unique references', () => {
    expect(findReferences('{{word}} is a {{word}} string {{other}}')).toEqual([
      'word',
      'other'
    ])
  })
})