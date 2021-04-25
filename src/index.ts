import { getInput, setOutput, warning, error } from '@actions/core'
import { getOctokit, context } from '@actions/github'
import * as github from './util/github'
import Badge from './util/badge'

const token = getInput('token')

if (context.eventName !== github.Event.PULL_REQUEST) {
  error(`Badger does not support '${context.eventName}' actions.`)
} else if (context.payload.action !== github.PullRequestAction.OPENED) {
  warning(`Skipping Badger, cannot handle '${context.action}' events.`)
} else if (!token) {
  error(`Authentication token not provided.`)
} else {
  const body = context.payload.pull_request.body
  const prefix = getInput('prefix')
  const suffix = getInput('suffix')

  const badges: Badge[] = []
  for (let i = 1; i <= 10; i++) {
    const index = i < 10 ? `0${i}` : i
    const input = getInput(`badge-${index}`)
  
    if (input) {
      badges.push(Badge.fromString(input))
    }
  }

  const badgeMarkdown = badges.map(badge => badge.toMarkdown()).join(' ')

  console.log(`Badges: ${badgeMarkdown}`)
  console.log(`Body:\n${body}\n\n`)

  let updatedBody = body.replace(/\r/g, '').replace(/(---\r?\n## 🦡 Badger\n([\s\S]+)?---)/, badgeMarkdown)
  
  if (prefix) {
    updatedBody = `${prefix}\n${updatedBody}`
  }

  if (suffix) {
    updatedBody = `${updatedBody}\n${suffix}`
  }

  console.log(`Updated Body:\n${updatedBody}\n\n`)

  const octokit = getOctokit(token)
  const request = {
    ...context.repo,
    owner: context.payload.sender.login,
    pull_number: context.payload.pull_request.number,
    body: updatedBody
  }

  console.log(`Sending request: ${JSON.stringify(request)}`)
  octokit.pulls.update(request)
}
