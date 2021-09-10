import GitHubHelper from "./GitHubHelper";

export default class PullRequestHelper extends GitHubHelper {
  public getPRDescripition() {
    return this.context.payload.pull_request.body
  }

  public async setPRDescription(body: string) {
    await this.withErrorHandling(async () => {
      await this.octokit.pulls.update({
        ...this.context.repo,
        pull_number: this.context.payload.pull_request.number,
        body
      })
    })
  }
}
