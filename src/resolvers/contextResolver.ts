import { Context } from "@actions/github/lib/context";
import { objectResolver } from "../util/Cache";

const withPullRequest = (context: Context) => context.payload.pull_request

const contextResolver = (context: Context) => objectResolver({
  branch: withPullRequest(context).head.ref,
  pr: withPullRequest(context).number.toString(),
  additions: withPullRequest(context).additions || 0,
  deletions: withPullRequest(context).deletions || 0
})

export default contextResolver
