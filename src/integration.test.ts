import PullRequestHelper from './util/github/PullRequestHelper'
import { IntegrationTestBuilder } from './util/testUtil'

jest.mock('@actions/core')
jest.mock('@actions/github')

const EXPECTED_DESCRIPTION = `This prefix has been added by Badger

<!-- Start of Badger Additions -->
[![Website: test-branch.dev.example.com](https://img.shields.io/static/v1?label=Website&message=test-branch.dev.example.com)](https://test-branch.dev.example.com) [![Trello: My Example Card](https://img.shields.io/static/v1?label=Trello&message=My%20Example%20Card)](https://trello.com/aoihioachw7e38)
<!-- End of Badger Additions -->

This is an example PR description

This suffix has been added by Badger`

beforeEach(() => {
  process.env = {}
})

it('should listen for opened pull requests', () => 
  new IntegrationTestBuilder()
    .withBranch('test-branch')
    .withBody('This is an example PR description', builder =>
      builder.withBadgerLines([
        'Trello Card: My Example Card',
        'Trello URL:https://trello.com/aoihioachw7e38'
      ])
    )
    .withInputs({
      prefix: 'This prefix has been added by Badger',
      suffix: 'This suffix has been added by Badger',
      'badge-01': 'Website: {{branch}}.{{BASE_DOMAIN}} (link=https://{{branch}}.{{BASE_DOMAIN}})',
      'badge-02': 'Trello: {{trello.card}} (link={{trello.url}})'
    })
    .withEnvironmentVariables({
      BASE_DOMAIN: 'dev.example.com',
      TRELLO_CARD: 'Untitled Card'
    })
    .forOpenedPullRequest((helper: PullRequestHelper, run: () => void) => {
      helper.setPRDescription = jest.fn()
    
      run()

      expect(helper.setPRDescription).toHaveBeenCalledWith(EXPECTED_DESCRIPTION)
    })
)
