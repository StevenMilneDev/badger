import { makeContext } from "../util/testUtil"
import contextResolver from "./contextResolver"

it('should return undefined for unknown properties', () => {
  const context = makeContext()
  const resolver = contextResolver(context)

  expect(resolver('wubadubadubdub')).toBe(undefined)
})

it('should return the branch name', () => {
  const branch = 'my-test-branch'
  const context = makeContext({ branch })
  const resolver = contextResolver(context)

  expect(resolver('branch')).toBe(branch)
})

it('should return the PR number', () => {
  const prNumber = 42
  const context = makeContext({ prNumber })
  const resolver = contextResolver(context)

  expect(resolver('pr')).toBe(prNumber.toString())
})

it('should return the additions', () => {
  const additions = 42
  const context = makeContext({ additions })
  const resolver = contextResolver(context)

  expect(resolver('additions')).toBe(additions)
})

it('should return 0 for additions when it is null', () => {
  const context = makeContext({ additions: null })
  const resolver = contextResolver(context)

  expect(resolver('additions')).toBe(0)
})

it('should return the deletions', () => {
  const deletions = 42
  const context = makeContext({ deletions })
  const resolver = contextResolver(context)

  expect(resolver('deletions')).toBe(deletions)
})

it('should return 0 for deletions when it is null', () => {
  const context = makeContext({ deletions: null })
  const resolver = contextResolver(context)

  expect(resolver('deletions')).toBe(0)
})