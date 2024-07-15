import { setFailed } from "@actions/core"
import { Context } from "@actions/github/lib/context"
import { Octokit } from "../GithubA"

export default class GitHubHelper {
  protected readonly context: Context
  protected readonly octokit: Octokit

  constructor(context: Context, octokit: Octokit) {
    this.context = context
    this.octokit = octokit
  }

  protected async withErrorHandling(callback: () => Promise<void>) {
    try {
      await callback()
    } catch(e) {
      setFailed(`Unable to connect to github API (${e.name}): ${e.message}${e.stack ? `\n\n${e.stack}` : ''}`)
    }
  }
}
