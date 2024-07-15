import { getInput, info } from '@actions/core'
import { Context } from '@actions/github/lib/context'
import Github, { Octokit } from './util/GithubA'
import Cache, { chainedResolver } from './util/Cache'
import contextResolver from './resolvers/contextResolver'
import descriptionResolver from './resolvers/descriptionResolver'
import environmentResolver from './resolvers/environmentResolver'
import Badger from './Badger'
import { PullRequestAction } from './util/github/events'
import PullRequestHelper from './util/github/PullRequestHelper'
import { getBadgeConfigs } from './util/actions'

/**
 * Creates the cache & resolver set used by Badger to resolve values from
 * variables in the badge configuration.
 * @param context The context for the GitHub Action call
 * @returns A cache populated with the necessary resolvers
 */
 const makeCache = (context: Context) => new Cache<string>(chainedResolver([
  contextResolver(context),       // Resolve variables from GitHub context
  descriptionResolver(context),   // Resolve variables from PR description
  environmentResolver,            // Resolve variables from environment variables
]))

export const setup = (github: Github) => {
  github.onPullRequest(PullRequestAction.OPENED, (context: Context, octokit: Octokit, helper: PullRequestHelper) => {
    const body = helper.getPRDescripition()
    const badger = new Badger(makeCache(context))
  
    info('Generating badges...')
    const badges = badger.badges(getBadgeConfigs())
    const markdown = badger.toMarkdown(badges)
  
    let updatedBody = body.replace(/\r/g, '').replace(/(---\r?\n## 🦡 Badger\n([\s\S]+)?---)/, markdown)
    
    updatedBody = badger.applyPrefix(updatedBody, getInput('prefix'))
    updatedBody = badger.applySuffix(updatedBody, getInput('suffix'))
  
    info('Updating PR description...')
    helper.setPRDescription(updatedBody)
  })
}