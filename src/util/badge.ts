import * as markdown from './markdown'
import { Shield, getStaticUrl } from './shields'

export interface BadgeOptions {
  link?: string
  logo?: string
  color?: string
  colour?: string
}

const enhanceOptions = (strings: string[]) => {
  const options: Record<string, string> = {}

  strings.forEach(str => {
    const [_, name, value] = str.match(/\((\S+?)=(\S+?)\)/)

    options[name] = value
  })

  return options
}

export default class Badge {
  public name: string
  public value: string
  public options: Record<string, string>

  public static fromString(str: string) {
    const isValid = str.match(/^.+: .+?(?:$| \(\S+?=\S?\))/)
    if (!isValid) {
      throw new Error(`Invalid badge configuration "${str}"`)
    }

    const name = str.match(/^(.+): /)[1]
    const value = str.match(/^.+: (.+?)( \(|$)/)[1]
    const options = str.match(/\(\S+?=\S+?\)/g) || []

    return new Badge(name, value, enhanceOptions(options))
  }

  public constructor(name: string, value: string, options: Record<string, string> = {}) {
    this.name = name
    this.value = value
    this.options = options
  }

  public toString() {
    let options = ''

    if (this.options.link) {
      options += `(link=${this.options.link})`
    }

    if (this.options.logo) {
      options += `(logo=${this.options.logo})`
    }

    if (this.options.color) {
      options += `(color=${this.options.color})`
    }

    if (this.options.colour) {
      options += `(colour=${this.options.colour})`
    }

    return `${this.name}: ${this.value} ${options}`.trim()
  }

  public toMarkdown() {
    const imageUrl = getStaticUrl(this.getShieldConfig())
    const image = markdown.image(imageUrl, `${this.name}: ${this.value}`)

    return this.options.link ? markdown.link(image, this.options.link) : image
  }

  private getShieldConfig() {
    const config: Shield = {
      label: this.name,
      message: this.value,
      options: {
        ...this.options
      }
    }

    // Link is handled in Markdown, don't need a custom image type from shields.io
    if (config.options.link) {
      delete config.options.link
    }

    // Convert colour to color
    if (config.options.colour) {
      config.options.color = config.options.colour
      delete config.options.colour
    }

    return config
  }
}