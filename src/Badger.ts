import { warning, info } from '@actions/core'
import Cache from "./util/Cache";
import { replaceAll } from "./util/string";
import Badge from "./util/badge";

export const findReferences = (source: string) => 
Array.from(new Set(source.match(/{{.+?}}/g))).map(variable => variable.match(/{{(.+?)}}/)[1])

export default class Badger {
  constructor(private variables: Cache<string>) {}

  public applyPrefix(body: string, prefix?: string) {
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

  public applySuffix(body: string, suffix?: string) {
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
   * Takes an array of badge configurations and returns Badge
   * instances.
   * @param config Array of badge config strings
   * @returns An array of Badge instances created from the configs
   */
  public badges(configs: string[]) {
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
   * Takes an array of badge instances and returns the badges
   * serialised into Markdown.
   * @param badges Array of Badge instances
   * @returns The badges serialised as Markdown
   */
  public toMarkdown(badges: Badge[]) {
    return `<!-- Start of Badger Additions -->\n${badges.map(badge => badge.toMarkdown()).join(' ')}\n<!-- End of Badger Additions -->`
  }

  /**
   * Resolves all references to variables in the given text
   * and replaces them with their values.
   * @param source Text with variable references
   * @returns The text with all references resolved
   */
  public resolve(source: string) {
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
