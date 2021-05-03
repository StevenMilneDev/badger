import { getInput, info, warning, error, setFailed } from '@actions/core'
import { getOctokit, context } from '@actions/github'
import { Context } from '@actions/github/lib/context'
import * as github from './util/github'
import Badge from './util/badge'
import _ from 'lodash'
import Resolver from './Resolver'

const token = getInput('token')
const isDebug = getInput('debug') === 'true'

if (isDebug) {
  console.log(`********************************\nGitHub Context\n\n${JSON.stringify(context)}\n\n********************************`)
}

function generateBadges(resolver: Resolver) {
  const badges: Badge[] = []

  for (let i = 1; i <= 10; i++) {
    const index = i < 10 ? `0${i}` : i
    const input = getInput(`badge-${index}`)
  
    if (input) {
      try {
        const resolvedConfig = resolver.resolve(input)
        const badge = Badge.fromString(resolvedConfig)

        badges.push(badge)
      } catch(error) {
        warning(`Skipping badge-${index}: ${error.message}`)
      }
    }
  }

  return `<!-- Start of Badger Additions -->\n${badges.map(badge => badge.toMarkdown()).join(' ')}\n<!-- End of Badger Additions -->`
}

async function updatePR(context: Context, body: string) {
  try {
    // TODO -- Set baseUrl option for compatibility with enterprise
    const octokit = getOctokit(token)

    const response = await octokit.pulls.update({
      ...context.repo,
      pull_number: context.payload.pull_request.number,
      body
    })

    console.log(`Response: ${JSON.stringify(response)}`)
  } catch (e) {
    const message = 'Unable to connect to github API'

    if (e instanceof Error) {
      error(`${message} (${e.name}): ${e.message}\n${e.stack}`)
    } else {
      error(`${message}: ${JSON.stringify(e)}`)
    }

    setFailed(message)
  }
}

if (context.eventName !== github.Event.PULL_REQUEST) {
  error(`Badger does not support '${context.eventName}' actions`)
} else if (context.payload.action !== github.PullRequestAction.OPENED) {
  warning(`Skipping Badger, cannot handle '${context.action}' events`)
} else if (!token) {
  error(`Authentication token not provided`)
  setFailed(`Authentication token not provided`)
} else {
  const resolver = new Resolver(context)

  const body = context.payload.pull_request.body
  const prefix = getInput('prefix')
  const suffix = getInput('suffix')

  info('Generating badges...')
  const badgeMarkdown = generateBadges(resolver)

  let updatedBody = body.replace(/\r/g, '').replace(/(---\r?\n## 🦡 Badger\n([\s\S]+)?---)/, badgeMarkdown)
  
  if (prefix) {
    info('Adding prefix...')

    try{
      const resolvedPrefix = resolver.resolve(prefix)
      updatedBody = `${resolvedPrefix}\n\n${updatedBody}`
    } catch(error) {
      warning(`Skipping prefix: ${error.message}`)
    }
  }

  if (suffix) {
    info('Adding suffix...')

    try{
      const resolvedSuffix = resolver.resolve(suffix)
      updatedBody = `${updatedBody}\n\n${resolvedSuffix}`
    } catch(error) {
      warning(`Skipping suffix: ${error.message}`)
    }
  }

  info('Updating PR description...')
  updatePR(context, updatedBody)
}
