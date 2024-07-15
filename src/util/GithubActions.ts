import { getInput } from '@actions/core'
import { getOctokit } from '@actions/github'
import { Context } from '@actions/github/lib/context'
import { GitHub } from '@actions/github/lib/utils';
import { ActionNotSupportedError, EventNotSupportedError, InvalidTokenError } from './github/errors';
import { Event, PullRequestAction } from './github/events';
import PullRequestHelper from './github/PullRequestHelper';

const INPUT_TOKEN = 'token'

const HELPER_BY_EVENT: Partial<Record<Event, EventHelperConstructors>> = {
  [Event.PULL_REQUEST]: PullRequestHelper
}

export type EventHelpers = PullRequestHelper | undefined
export type EventHelperConstructors = typeof PullRequestHelper | undefined

export type EventHandler = (context: Context, octokit: Octokit, helper?: PullRequestHelper) => void

export type ActionHandlers = Partial<Record<string, Array<EventHandler>>>

export type Octokit = InstanceType<typeof GitHub>

export default class GithubActions {
  private readonly token: string
  private handlers: Partial<Record<Event, ActionHandlers>>

  constructor() {
    this.token = getInput(INPUT_TOKEN)
    this.handlers = {}
  }

  public handle(context: Context) {
    const event = context.eventName as Event
    const action = context.payload.action

    if (!this.token) {
      throw new InvalidTokenError()
    }

    const eventHandlers = this.handlers[event]
    if (!eventHandlers) {
      throw new EventNotSupportedError(event)
    }

    const callbacks = this.handlers[event][action]
    if (!callbacks) {
      throw new ActionNotSupportedError(event, action)
    }

    // TODO -- Set baseUrl option for compatibility with enterprise
    const octokit = getOctokit(this.token)
    const helper = HELPER_BY_EVENT[event] ? new (HELPER_BY_EVENT[event])(context, octokit) : undefined

    for (const callback of callbacks) {
      callback(context, octokit, helper)
    }
  }

  public onPullRequest(action: PullRequestAction, handler: EventHandler): GithubActions {
    return this.addEventHandler(Event.PULL_REQUEST, action, handler)
  }

  public addEventHandler(event: Event, action: string, handler: EventHandler): GithubActions {
    if (!this.handlers[event]) {
      this.handlers[event] = {}
    }

    if (!this.handlers[event][action]) {
      this.handlers[event][action] = []
    }

    this.handlers[event][action].push(handler)

    return this
  }
}
