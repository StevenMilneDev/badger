
export enum Event {
  CHECK_RUN = 'check_run',
  CHECK_SUITE = 'check_suite',
  CREATE = 'create',
  DELETE = 'delete',
  DEPLOYMENT = 'deployment',
  DEPLOYMENT_STATUS = 'deployment_status',
  FORK = 'fork',
  GOLLUM = 'gollum',
  ISSUE_COMMENT = 'issue_comment',
  ISSUES = 'issues',
  LABEL = 'label',
  MILESTONE = 'milestone',
  PAGE_BUILD = 'page_build',
  PROJECT = 'project',
  PROJECT_CARD = 'project_card',
  PROJECT_COLUMN = 'project_column',
  PUBLIC = 'public',
  PULL_REQUEST = 'pull_request',
  PULL_REQUEST_REVIEW = 'pull_request_review',
  PULL_REQUEST_REVIEW_COMMENT = 'pull_request_review_comment',
  PULL_REQUEST_TARGET = 'pull_request_target',
  PUSH = 'push',
  REGISTRY_PACKAGE = 'registry_package',
  RELEASE = 'release',
  STATUS = 'status',
  WATCH = 'watch',
  WORKFLOW_RUN = 'workflow_run'
}

export enum PullRequestAction {
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',
  LABELED = 'labeled',
  UNLABELED = 'unlabeled',
  OPENED = 'opened',
  EDITED = 'edited',
  CLOSED = 'closed',
  REOPENED = 'reopened',
  SYNCHRONIZE = 'synchronize',
  READY_FOR_REVIEW = 'ready_for_review',
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  REVIEW_REQUESTED = 'review_requested',
  REVIEW_REQUEST_REMOVED = 'review_request_removed'
}
