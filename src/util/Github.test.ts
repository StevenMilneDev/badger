import Github from './Github'
import { getInput } from '@actions/core'
import { Event, PullRequestAction } from './github/events'
import { ActionNotSupportedError, EventNotSupportedError, InvalidTokenError } from './github/errors'
import PullRequestHelper from './github/PullRequestHelper'
import { makeContext, mockify } from './testUtil'

jest.mock('@actions/core')

it('should throw an error if no token is provided', () => {
  mockify(getInput).mockReturnValue(undefined)

  const github = new Github()

  expect(() => github.handle(makeContext())).toThrowError(InvalidTokenError)
})

it('should not throw an error when token is provided', () => {
  mockify(getInput).mockReturnValue('some-token')

  const github = new Github()
  github.onPullRequest(PullRequestAction.OPENED, () => {})

  expect(() => github.handle(makeContext({ eventName: Event.PULL_REQUEST, action: PullRequestAction.OPENED }))).not.toThrow()
})

describe('Events', () => {
  beforeEach(() => {
    mockify(getInput).mockReturnValue('some-token')
  })

  it('should throw an error if event not handled', () => {
    const github = new Github()

    const handle = () => github.handle(makeContext({ eventName: Event.PULL_REQUEST, action: PullRequestAction.OPENED }))

    expect(handle).toThrowError(EventNotSupportedError)
  })

  it('should throw an error if action not handled', () => {
    const github = new Github()
    const context = makeContext({ eventName: Event.PULL_REQUEST, action: PullRequestAction.EDITED })

    github.onPullRequest(PullRequestAction.OPENED, () => {})

    const handle = () => github.handle(context)

    expect(handle).toThrowError(ActionNotSupportedError)
  })

  it('should invoke all action handlers', () => {
    const github = new Github()
    const context = makeContext({ eventName: Event.PULL_REQUEST, action: PullRequestAction.OPENED })

    const handler1 = jest.fn()
    const handler2 = jest.fn()
    const handler3 = jest.fn()
    const handler4 = jest.fn()

    github
      .addEventHandler(Event.PULL_REQUEST, PullRequestAction.OPENED, handler1)
      .addEventHandler(Event.PULL_REQUEST, PullRequestAction.CLOSED, handler2)
      .addEventHandler(Event.PULL_REQUEST, PullRequestAction.OPENED, handler3)
      .addEventHandler(Event.PULL_REQUEST_REVIEW, 'something', handler4)
    
    github.handle(context)

    expect(handler1).toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
    expect(handler3).toHaveBeenCalled()
    expect(handler4).not.toHaveBeenCalled()
  })
})

describe('Helpers', () => {
  it('should not provide a helper to events which dont one', () => {
    const github = new Github()
    const context = makeContext({ eventName: Event.FORK, action: 'something' })
    const handler = jest.fn()

    github.addEventHandler(Event.FORK, 'something', handler)
    github.handle(context)

    expect(handler).toHaveBeenCalledWith(context, expect.any(Object), undefined)
  })

  it('should provide a helper for pull request events', () => {
    const github = new Github()
    const context = makeContext({ eventName: Event.PULL_REQUEST, action: PullRequestAction.OPENED })
    const handler = jest.fn()

    github.addEventHandler(Event.PULL_REQUEST, PullRequestAction.OPENED, handler)
    github.handle(context)

    expect(handler).toHaveBeenCalledWith(context, expect.any(Object), expect.any(PullRequestHelper))
  })
})