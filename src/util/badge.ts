import * as markdown from './markdown'
import { Shield, getStaticUrl } from './shields'

export interface BadgeOptions {
  link?: string
  icon?: string
  color?: string
  colour?: string
}

export default class Badge {
  public name: string
  public value: string

  private options: BadgeOptions

  public static fromString(str: string) {
    const name = str.match(/^(.+): /)[1]
    const value = str.match(/^.+: (.+?)( \(|$)/)[1]

    return new Badge(name, value)
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

    if (this.options.icon) {
      options += `(icon=${this.options.icon})`
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

    if (this.options.icon) {
      config.options.icon = this.options.icon
    }

    if (this.options.colour || this.options.color) {
      config.options.color = this.options.colour || this.options.color
    }

    return config
  }
}