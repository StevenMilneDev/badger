import { link, image } from './markdown'

it('should support hyperlinks', () => {
  const label = 'Click Me!'
  const url = 'https://example.com'

  expect(link(label, url)).toEqual(`[${label}](${url})`)
})

it('should support images', () => {
  const alt = 'A cute kitten'
  const url = 'https://example.com'

  expect(image(url, alt)).toEqual(`![${alt}](${url})`)
})