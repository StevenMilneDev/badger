import Resolver from "./Resolver"
import Badge from "./util/badge"
import { SHIELDS_IO_ENDPOINT } from "./util/shields"

const body = `
This is some prelude text which should be ignored...

---
## 🦡 Badger
This section will be removed and replaced with generated badges after you save. The fields
below are required by some of the badges, fill them in if you would like the badges to be
added. ***Note: It may take a few minutes after saving before this section is replaced.***

Trello Card: My Trello Card
Trello URL: https://trello.com/test-feature
---

This is some trailing text which, again, should be ignored.
`.replace('\n', '\r\n')

const context: any = {
  payload: {
    pull_request: {
      additions: 172,
      deletions: 75,
      number: 12,
      body,
      head: {
        ref: 'test-feature'
      }
    }
  }
}

it('should generate badges', () => {
  const resolver = new Resolver(context)

  const inputs = [
    'Website: {{branch}}.gleanweb.sonocent.dev (link=https://{{branch}}.gleanweb.sonocent.dev)(logo=google-chrome)(colour=white)',
    'Trello: {{trello.card}} (link={{trello.url}})(logo=trello)',
    'Empty: Yup'
  ]

  const resolved = inputs.map(input => resolver.resolve(input))
  const badges = resolved.map(input => Badge.fromString(input))
  const markdown = badges.map(badge => badge.toMarkdown())

  const domain = 'test-feature.gleanweb.sonocent.dev'

  expect(markdown[0]).toEqual(`[![Website: ${domain}](${SHIELDS_IO_ENDPOINT}?label=Website&message=${domain}&logo=google-chrome&color=white)](https://${domain})`)
  expect(markdown[1]).toEqual(`[![Trello: My Trello Card](${SHIELDS_IO_ENDPOINT}?label=Trello&message=My%20Trello%20Card&logo=trello)](https://trello.com/test-feature)`)
  expect(markdown[2]).toEqual(`![Empty: Yup](${SHIELDS_IO_ENDPOINT}?label=Empty&message=Yup)`)
})