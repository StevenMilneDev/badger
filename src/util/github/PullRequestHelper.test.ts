import { setFailed } from "@actions/core"
import { Context } from "@actions/github/lib/context"
import { Octokit } from "../GithubActions"
import PullRequestHelper from "./PullRequestHelper"

jest.mock("@actions/core")

interface MockContext {
  body: string
  number: number
  owner: string
  repo: string
}

const makeContext = ({ body = '', number = 1, owner = 'StevenMilneDev', repo = 'badger' }: Partial<MockContext> = {}) => ({
  payload: {
    pull_request: {
      number,
      body
    }
  },
  repo: {
    owner,
    repo
  }
} as Context)

const makeOctokit = (update: () => void = jest.fn()) => ({
  rest: {
    pulls: {
      update
    }
  }
} as Octokit)

describe('Description', () => {
  it('should get the description', () => {
    const body = 'Lorem ipsum... something something Latin.'
    const context = makeContext({ body })
    const helper = new PullRequestHelper(context, makeOctokit())

    expect(helper.getPRDescripition()).toBe(body)
  })

  it('should set the description', async () => {
    const context = makeContext()
    const octokit = makeOctokit()
    const helper = new PullRequestHelper(context, octokit)

    const body = 'Something else'
    await helper.setPRDescription(body)

    expect(octokit.rest.pulls.update).toHaveBeenCalledWith(expect.objectContaining({ body }))
  })

  it('should fail the run if setting the description fails', async () => {
    const update = jest.fn().mockImplementation(() => {
      throw new Error('Whoops')
    })
   
    const helper = new PullRequestHelper(makeContext(), makeOctokit(update))

    await helper.setPRDescription('Something else')
    
    expect(setFailed).toHaveBeenCalled()
  })
})