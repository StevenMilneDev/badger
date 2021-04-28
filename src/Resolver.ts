import { warning } from '@actions/core'
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
      const value = this.getVariable(reference)

      if (!value) {
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
      additions: this.getPullRequest().additions,
      deletions: this.getPullRequest().deletions
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
    
    return this.variables[name]
  }

  private getBadgerSection() {
    const body = this.getPullRequest().body
    const regex = /(---\r?\n## 🦡 Badger\n([\s\S]+)?---)/

    if (!body.match(regex)) {
      warning('Could not find 🦡 Badger section in description')
      console.log(JSON.stringify(this.getPullRequest()))
      return null
    }

    return body.match(regex)[1]
  }
}
