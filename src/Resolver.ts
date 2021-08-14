import { warning } from '@actions/core'
import { Context } from '@actions/github/lib/context'
import _ from 'lodash'
import { replaceAll, asEnvironmentVariableName } from './util/string'
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
      const value = this.getVariable(reference)

      if (value === null || value === undefined) {
        throw new Error(`Could not resolve variable {{${reference}}}`)
      }

      result = replaceAll(result, `{{${reference}}}`, value)
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
      additions: this.getPullRequest().additions || 0,
      deletions: this.getPullRequest().deletions || 0
    }
  }

  private getVariable(name: string) {
    if (this.variables[name]) {
      return this.variables[name]
    }
    
    const body = this.getBadgerSection()

    if (!body) {
      return undefined
    }

    const regex = new RegExp(`^${name.replace('.', ' ')}: (.+?)\r?\n`, 'im')
    const results = body.match(regex)

    if (results) {
      this.variables[name] = results[1]
    }

    // Fall back to env var if variable not found in PR
    const env = this.getEnvironmentVariable(name)
    if (!this.variables[name] && env) {
      this.variables[name] = env
    }
    
    return this.variables[name]
  }

  private getBadgerSection() {
    const body = this.getPullRequest().body
    const regex = /(---\r?\n## 🦡 Badger\r?\n([\s\S]+)?---)/

    if (!body.match(regex)) {
      warning('Could not find 🦡 Badger section in description')
      return null
    }

    return body.match(regex)[1]
  }

  private getEnvironmentVariable(name: string) {
    return process.env[name] || process.env[asEnvironmentVariableName(name)]
  }
}
