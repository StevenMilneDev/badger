import { getInput, setOutput, warning, error } from '@actions/core'
import { getOctokit, context } from '@actions/github'
import * as github from './util/github'
// import Badge from './util/badge'

if (context.eventName !== github.Event.PULL_REQUEST) {
  error(`Badger does not support ${context.eventName} actions.`)
} else if (context.action !== github.PullRequestAction.OPENED) {
  warning(`Skipping Badger, cannot handle ${context.action} events.`)
} else {
  const body = context.payload.pull_request.body
  const badges: string[] = []

  for (let i = 1; i <= 10; i++) {
    const index = i < 10 ? `0${i}` : i
    const input = getInput(`badge-${index}`)
  
    if (input) {
      badges.push(input)
    }
  }

  console.log(`Badges: ${JSON.stringify(badges)}`)
  console.log(`Body:\n${body}`)
}
