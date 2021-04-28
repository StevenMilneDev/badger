import { getInput, setOutput, info, warning, error } from '@actions/core'
import { getOctokit, context } from '@actions/github'
import * as github from './util/github'
import Badge from './util/badge'
import { Context } from '@actions/github/lib/context'
import _ from 'lodash'

const token = getInput('token')

const replaceAll = (source: string, token: string, value: string) => {
  let result = source

  while(result.includes(token)) {
    result = result.replace(token, value)
  }

  return result
}

const makeResolver = (name: string, value: string) =>  (source: string) => replaceAll(source, `{{${name}}}`, value)

const resolveVariables = (context: Context, source: string) => {
  if (!source.match(/{{.+?}}/)) return source

  const variables = _.uniq(source.match(/{{.+?}}/g)).map(variable => variable.match(/{{(.+?)}}/)[1])

  const resolvers: Record<string, (value: string) => string> = {
    branch: makeResolver('branch', context.payload.pull_request.head.ref),
    pr: makeResolver('pr', context.payload.pull_request.number.toString()),
    additions: makeResolver('additions', context.payload.pull_request.additions),
    deletions: makeResolver('deletions', context.payload.pull_request.deletions)
  }

  let result = source
  for (const variable of variables) {
    if (!resolvers[variable]) {
      throw new Error(`Could not resolve variable {{${variable}}}`)
    }

    result = resolvers[variable](result)
  }

  return result
}

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
      try {
        const resolvedConfig = resolveVariables(context, input)
        const badge = Badge.fromString(resolvedConfig)

        badges.push(badge)
      } catch(error) {
        warning(`Skipping badge-${index}: ${error.message}`)
      }
    }
  }

  const badgeMarkdown = `<!-- Start of Badger Additions -->\n${badges.map(badge => badge.toMarkdown()).join(' ')}\n<!-- End of Badger Additions -->`

  let updatedBody = body.replace(/\r/g, '').replace(/(---\r?\n## 🦡 Badger\n([\s\S]+)?---)/, badgeMarkdown)
  
  if (prefix) {
    info('Adding prefix...')

    try{
      const resolvedPrefix = resolveVariables(context, prefix)
      updatedBody = `${resolvedPrefix}\n\n${updatedBody}`
    } catch(error) {
      warning(`Skipping prefix: ${error.message}`)
    }
  }

  if (suffix) {
    info('Adding suffix...')

    try{
      const resolvedSuffix = resolveVariables(context, suffix)
      updatedBody = `${updatedBody}\n\n${resolvedSuffix}`
    } catch(error) {
      warning(`Skipping suffix: ${error.message}`)
    }
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
