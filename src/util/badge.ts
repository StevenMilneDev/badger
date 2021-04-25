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

  return {
    link: options.link,
    logo: options.logo,
    color: options.color,
    colour: options.colour
  } as BadgeOptions
}

export default class Badge {
  public name: string
  public value: string

  private options: BadgeOptions

  public static fromString(str: string) {
    const name = str.match(/^(.+): /)[1]
    const value = str.match(/^.+: (.+?)( \(|$)/)[1]
    const options = str.match(/\(\S+?=\S+?\)/g)

    return new Badge(name, value, enhanceOptions(options))
  }

  public constructor(name: string, value: string, options: BadgeOptions = {}) {
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

    return `${this.name}: ${this.value} ${options}`
  }

  public toMarkdown() {
    const imageUrl = getStaticUrl(this.getShieldConfig())
    const image = markdown.image(imageUrl, `${this.name}: ${this.value}`)

    return this.options.link ? markdown.link(image, this.options.link) : image
  }

  public getShieldConfig() {
    const config: Shield = {
      label: this.name,
      message: this.value,
      options: {}
    }

    if (this.options.link) {
      config.options.link = this.options.link
    }

    if (this.options.logo) {
      config.options.logo = this.options.logo
    }

    if (this.options.colour || this.options.color) {
      config.options.color = this.options.colour || this.options.color
    }

    return config
  }
}