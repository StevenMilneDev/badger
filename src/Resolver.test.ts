import Resolver from "./Resolver"

interface MockPullRequest {
  additions: number
  deletions: number
  number: number
  head: {
    ref: string
  }
}

const PR_BODY = `
This is some prelude text which should be ignored...

---
## 🦡 Badger
This section will be removed and replaced with generated badges after you save. The fields
below are required by some of the badges, fill them in if you would like the badges to be
added. ***Note: It may take a few minutes after saving before this section is replaced.***

Trello Card: My Trello Card
Trello URL: https://trello.com/sjaoigdic
---

This is some trailing text which, again, should be ignored.
`

const getContext = ({
  additions = 0,
  deletions = 0,
  number = 1,
  head = { ref: 'test-branch' }
}: Partial<MockPullRequest> = {}) => ({
  payload: {
    pull_request: {
      body: PR_BODY,
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

describe('Dynamic Variables', () => {
  it('should find variable from PR description', () => {
    const resolver = new Resolver(getContext())

    const source = `Trello: {{trello.card}} (link={{trello.url}})`
    const result = resolver.resolve(source)

    expect(result).toEqual('Trello: My Trello Card (link=https://trello.com/sjaoigdic)')
  })
})