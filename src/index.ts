import { context } from '@actions/github'
import { setup } from './app'
import GithubActions from './util/GithubActions'
import { ActionNotSupportedError, EventNotSupportedError } from './util/github/errors'
import { warning, error } from '@actions/core'

const actions = new GithubActions()

setup(actions)

try {
  actions.handle(context)
} catch(e) {
  if (e instanceof EventNotSupportedError) {
    error(`Badger does not support '${e.event}' actions`)
  } else if (e instanceof ActionNotSupportedError) {
    warning(`Skipping Badger, cannot handle '${e.action}' events`)
  } else {
    throw e
  }
}
