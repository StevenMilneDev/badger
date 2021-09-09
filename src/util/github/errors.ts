
export class EventNotSupportedError extends Error {
  constructor(public event: string) {
    super(`Github event ${event} not supported.`)
  }
}

export class ActionNotSupportedError extends Error {
  constructor(public event: string, public action: string) {
    super(`Event ${event} action ${action} not supported.`)
  }
}

export class InvalidTokenError extends Error {
  constructor() {
    super('Authentication token not provided or valid')
  }
}
