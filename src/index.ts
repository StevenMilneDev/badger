import { context } from '@actions/github'
import { setup } from './app'
import Github from './util/github'
import { ActionNotSupportedError, EventNotSupportedError } from './util/github/errors'
import { warning, error } from '@actions/core'

const github = new Github()

setup(github)

try {
  github.handle(context)
} catch(e) {
  if (e instanceof EventNotSupportedError) {
    error(`Badger does not support '${e.event}' actions`)
  } else if (e instanceof ActionNotSupportedError) {
    warning(`Skipping Badger, cannot handle '${e.action}' events`)
  } else {
    throw e
  }
}
