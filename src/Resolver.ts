import { Context } from '@actions/github/lib/context'
import _ from 'lodash'
import { replaceAll } from './util/string'
import { findReferences } from './util/variables'

export default class Resolver {
  private context: Context
  private variables: Record<string, string>

  constructor(context: Context) {
    this.context = context
    this.variables = this.getGitHubVariables()
  }

  public resolve(source: string) {
    if (!source.match(/{{.+?}}/)) return source

    const references = findReferences(source)

    let result = source
    for (const reference of references) {
      const value = this.variables[reference]

      if (!value) {
        throw new Error(`Could not resolve variable {{${reference}}}`)
      }

      result = replaceAll(result, `{{${reference}}}`, this.variables[reference])
    }

    return result
  }

  private getPullRequest() {
    return this.context.payload.pull_request
  }

  private getGitHubVariables(): Record<string, string> {
    return {
      branch: this.getPullRequest().head.ref,
      pr: this.getPullRequest().number.toString(),
      additions: this.getPullRequest().additions,
      deletions: this.getPullRequest().deletions
    }
  }
}
