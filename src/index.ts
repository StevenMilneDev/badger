import { getInput, setOutput, info, warning, error } from '@actions/core'
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

  info('Generating badges...')
  const badges: Badge[] = []
  for (let i = 1; i <= 10; i++) {
    const index = i < 10 ? `0${i}` : i
    const input = getInput(`badge-${index}`)
  
    if (input) {
      badges.push(Badge.fromString(input))
    }
  }

  const badgeMarkdown = `<!-- Start of Badger Additions -->\n${badges.map(badge => badge.toMarkdown()).join(' ')}\n<!-- End of Badger Additions -->`

  let updatedBody = body.replace(/\r/g, '').replace(/(---\r?\n## 🦡 Badger\n([\s\S]+)?---)/, badgeMarkdown)
  
  if (prefix) {
    info('Adding prefix...')
    updatedBody = `${prefix}\n\n${updatedBody}`
  }

  if (suffix) {
    info('Adding suffix...')
    updatedBody = `${updatedBody}\n\n${suffix}`
  }

  info('Updating PR description...')
  const octokit = getOctokit(token)
  const request = {
    ...context.repo,
    owner: context.payload.sender.login,
    pull_number: context.payload.pull_request.number,
    body: updatedBody
  }

  octokit.pulls.update(request)
}
