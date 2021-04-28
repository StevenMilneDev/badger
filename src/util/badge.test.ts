import Badge from "./badge"
import { SHIELDS_IO_ENDPOINT } from "./shields"

it('should construct from a string without options', () => {
  const name = 'Label'
  const value = 'Message'
  const badge = Badge.fromString(`${name}: ${value}`)

  expect(badge.name).toEqual(name)
  expect(badge.value).toEqual(value)
})

it('should construct from a string with options', () => {
  const name = 'Label'
  const value = 'Message'
  const link = 'https://example.com'
  const logo = 'trello'
  const colour = 'purple'
  const badge = Badge.fromString(`${name}: ${value} (link=${link})(logo=${logo})(colour=${colour})(color=${colour})`)

  expect(badge.name).toEqual(name)
  expect(badge.value).toEqual(value)
  expect(badge.options.link).toEqual(link)
  expect(badge.options.logo).toEqual(logo)
  expect(badge.options.color).toEqual(colour)
  expect(badge.options.colour).toEqual(colour)
})

it('should throw an error when constructing from an invalid string', () => {
  const config = 'this isn\'t actually a badge...'
  const runner = () => Badge.fromString(config)

  expect(runner).toThrow(`Invalid badge configuration "${config}"`)
})

it('should convert to a string', () => {
  const config = 'Label: Message (link=https://example.com)'
  const badge = Badge.fromString(config)

  expect(badge.toString()).toEqual(config)
})

it('should convert to Markdown image if no link present', () => {
  const badge = new Badge('Label', 'Message', { colour: 'purple' })

  expect(badge.toMarkdown()).toEqual(`![Label: Message](${SHIELDS_IO_ENDPOINT}?label=Label&message=Message&color=purple)`)
})

it('should convert to Markdown link if link present', () => {
  const badge = new Badge('Label', 'Message', { link: 'https://example.com' })

  expect(badge.toMarkdown()).toEqual(`[![Label: Message](${SHIELDS_IO_ENDPOINT}?label=Label&message=Message)](https://example.com)`)
})

it('should convert colour to color in Markdown', () => {
  const badge = new Badge('Label', 'Message', { colour: 'purple' })

  expect(badge.toMarkdown()).toEqual(`![Label: Message](${SHIELDS_IO_ENDPOINT}?label=Label&message=Message&color=purple)`)
})