import PullRequestHelper from './github/PullRequestHelper'
import { Event, PullRequestAction } from './github/events'
import { getInput } from '@actions/core'
import { setup } from '../app'
import Github from './github'

export interface ContextConfig {
  eventName: string
  action: string,
  body: string,
  branch: string
  prNumber: number
  additions: number
  deletions: number
}

export const mockify = (fn: Function) => fn as jest.Mock

export const makeContext = ({
  eventName = Event.PULL_REQUEST,
  action = PullRequestAction.OPENED,
  body = '',
  branch = 'test-branch',
  prNumber = 1,
  additions = 10,
  deletions = 5
}: Partial<ContextConfig> = {}) => ({
  eventName,
  payload: {
    action,
    pull_request: {
      number: prNumber,
      additions,
      deletions,
      body,
      head: {
        ref: branch
      }
    }
  }
} as any)

export const setupEnvironment = (context: any, inputs: Record<string, string>) => {
  mockify(getInput).mockImplementation((name: string) => {
    return inputs[name]
  })

  const github = new Github()

  github.onPullRequest = jest.fn()

  setup(github)

  return github
}

export class IntegrationTestBuilder {
  private context: any = makeContext()
  private inputs: Record<string, string> = {}

  public withBranch(name: string) {
    this.context.payload.pull_request.head.ref = name
    return this
  }

  public withBody(body: string, callback: (builder: BodyBuilder) => BodyBuilder) {
    if (callback) {
      this.context.payload.pull_request.body = callback(new BodyBuilder(body)).build()
    } else {
      this.context.payload.pull_request.body = body
    }

    return this
  }

  public withInput(name: string, value: string) {
    this.inputs[name] = value
    return this
  }

  public withInputs(inputs: Record<string, string>) {
    this.inputs = inputs
    return this
  }

  public withEnvironmentVariable(name: string, value: string) {
    process.env[name] = value
    return this
  }

  public withEnvironmentVariables(vars: Record<string, string>) {
    process.env = vars
    return this
  }

  public forOpenedPullRequest(callback: (helper: PullRequestHelper, call: () => void) => void) {
    const github = setupEnvironment(this.context, this.inputs)

    expect(github.onPullRequest).toHaveBeenCalledWith(PullRequestAction.OPENED, expect.any(Function))
    const handler = (github.onPullRequest as jest.Mock).mock.calls[0][1]

    const octokit = {} as any
    const helper = new PullRequestHelper(this.context, octokit)
    
    callback(helper, () => handler(this.context, octokit, helper))
  }
}

export class BodyBuilder {
  private body: string

  constructor(body: string) {
    this.body = body
  }

  public withPrefix(prefix: string) {
    this.body = `${prefix}\n${this.body}`

    return this
  }

  public withSuffix(suffix: string) {
    this.body = `${this.body}\n${suffix}`

    return this
  }

  public withBadgerSection(content: string) {
    return this.withPrefix(`---
## 🦡 Badger
${content}
---
`)
  }

  public withBadgerLines(lines: string[]) {
    return this.withBadgerSection(lines.join('\n'))
  }

  public build() {
    return this.body.replace('\n', '\r\n')
  }
}