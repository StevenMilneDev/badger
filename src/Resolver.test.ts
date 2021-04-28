import Resolver from "./Resolver"

interface MockPullRequest {
  additions: number
  deletions: number
  number: number
  head: {
    ref: string
  }
}

const getContext = ({
  additions = 0,
  deletions = 0,
  number = 1,
  head = { ref: 'test-branch' }
}: Partial<MockPullRequest> = {}) => ({
  payload: {
    pull_request: {
      additions,
      deletions,
      number,
      head
    }
  }
}) as any

it('should do nothing if no references found', () => {
  const resolver = new Resolver(getContext())

  const source = 'this is a text without variables'
  const result = resolver.resolve(source)

  expect(result).toEqual(source)
})

describe('Static Variables', () => {
  it('should support {{branch}}', () => {
    const ref = 'my-branch'
    const pr = { head: { ref }}
    const resolver = new Resolver(getContext(pr))

    const source = 'something {{branch}} something {{branch}}'
    const result = resolver.resolve(source)

    expect(result).toEqual(`something ${ref} something ${ref}`)
  })

  it('should support {{pr}}', () => {
    const number = 42
    const resolver = new Resolver(getContext({ number }))

    const source = 'something {{pr}} something {{pr}}'
    const result = resolver.resolve(source)

    expect(result).toEqual(`something ${number} something ${number}`)
  })

  it('should support {{additions}}', () => {
    const additions = 256
    const resolver = new Resolver(getContext({ additions }))

    const source = 'something {{additions}} something {{additions}}'
    const result = resolver.resolve(source)

    expect(result).toEqual(`something ${additions} something ${additions}`)
  })

  it('should support {{deletions}}', () => {
    const deletions = 512
    const resolver = new Resolver(getContext({ deletions }))

    const source = 'something {{deletions}} something {{deletions}}'
    const result = resolver.resolve(source)

    expect(result).toEqual(`something ${deletions} something ${deletions}`)
  })
})