import GitHubHelper from "./GitHubHelper"
import { setFailed } from "@actions/core"

jest.mock("@actions/core")

class TestHelper extends GitHubHelper {
  public async succeed() {
    await this.withErrorHandling(async () => {})
  }

  public async fail() {
    await this.withErrorHandling(async () => {
      throw new Error('Whoops!')
    })
  }
}

describe('With Error Handling', () => {
  it('should not fail the run if no error occurs', async () => {
    const mockContext = {} as any
    const mockOctokit = {} as any

    const helper = new TestHelper(mockContext, mockOctokit)
    await helper.succeed()

    expect(setFailed).not.toHaveBeenCalled()
  })

  it('should fail the run on error', async () => {
    const mockContext = {} as any
    const mockOctokit = {} as any

    const helper = new TestHelper(mockContext, mockOctokit)
    await helper.fail()

    expect(setFailed).toHaveBeenCalled()
  })
})