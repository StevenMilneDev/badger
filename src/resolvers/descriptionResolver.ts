import { Context } from "@actions/github/lib/context";
import { warning } from '@actions/core'

const getBadgerSection = (description: string) => {
  const regex = /(---\r?\n## 🦡 Badger\r?\n([\s\S]+)?---)/

  if (!description.match(regex)) {
    warning('Could not find 🦡 Badger section in description')
    return null
  }

  return description.match(regex)[1]
}

const descriptionResolver = (context: Context) => (name: string) => {
  const description = context.payload.pull_request.body
  const badger = getBadgerSection(description)

  if (!badger) {
    return undefined
  }

  const regex = new RegExp(`^${name.replace('.', ' ')}:\w?(.+?)\r?\n`, 'im')
  const result = badger.match(regex)

  return result && result[1] ? result[1].trim() : undefined
}

export default descriptionResolver
