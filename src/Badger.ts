import { warning, info } from '@actions/core'
import Cache from "./util/Cache";
import { replaceAll } from "./util/string";
import Badge from "./util/badge";

export const findReferences = (source: string) => 
  Array.from(new Set(source.match(/{{.+?}}/g))).map(variable => variable.match(/{{(.+?)}}/)[1])

export default class Badger {
  constructor(private variables: Cache<string>) {}

  /**
   * Takes some body text and replaces the badger section in it (if present) with the provided
   * badges. An optional prefix and suffix can also be added to the body content.
   */
  public apply(body: string, badges: string[] = [], prefix?: string, suffix?: string): string {
    const markdown = this.toMarkdown(this.badges(badges))
    let updated = body.replace(/\r/g, '').replace(/(---\r?\n## Badger\n([\s\S]*?)---)/, markdown)

    updated = this.applyPrefix(updated, prefix)
    updated = this.applySuffix(updated, suffix)

    return updated
  }

  /**
   * Resolves variables in the prefix text and then prefixes it to the provided body
   */
  public applyPrefix(body: string, prefix?: string): string {
    if (!prefix) return body
    info('Adding prefix...')

    try{
      const resolvedPrefix = this.resolve(prefix)
      return `${resolvedPrefix}\n\n${body}`
    } catch(error) {
      warning(`Skipping prefix: ${error.message}`)
    }

    return body
  }

  /**
   * Resolves variables in the suffix text and then suffixes it to the provided body
   */
  public applySuffix(body: string, suffix?: string): string {
    if (!suffix) return body
    info('Adding suffix...')

    try{
      const resolvedSuffix = this.resolve(suffix)
      return `${body}\n\n${resolvedSuffix}`
    } catch(error) {
      warning(`Skipping suffix: ${error.message}`)
    }

    return body
  }

  /**
   * Takes an array of badge configurations and returns Badge instances
   */
  public badges(configs: string[]): Badge[] {
    const badges: Badge[] = []

    let index = 0
    for (const config of configs) {
      index++

      if (config) {
        try {
          const resolvedConfig = this.resolve(config)
          const badge = Badge.fromString(resolvedConfig)

          badges.push(badge)
        } catch(error) {
          warning(`Skipping badge-${index.toString().padStart(2, '0')}: ${error.message}`)
        }
      }
    }

    return badges
  }

  /**
   * Takes an array of badge instances and returns the badges serialised into Markdown
   */
  public toMarkdown(badges: Badge[]): string {
    return `<!-- Start of Badger Additions -->\n${badges.map(badge => badge.toMarkdown()).join(' ')}\n<!-- End of Badger Additions -->`
  }

  /**
   * Resolves all references to variables in the given text and replaces them with their values
   */
  public resolve(source: string): string {
    if (!source.match(/{{.+?}}/)) return source

    const references = findReferences(source)

    let result = source
    for (const reference of references) {
      const value = this.variables.get(reference)

      if (value === null || value === undefined) {
        throw new Error(`Could not resolve variable {{${reference}}}`)
      }

      result = replaceAll(result, `{{${reference}}}`, value)
    }

    return result
  }
}
