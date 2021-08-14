
export const replaceAll = (source: string, token: string, value: string) => {
  let result = source

  while(result.includes(token)) {
    result = result.replace(token, value)
  }

  return result
}

/**
 * Formats the given variable name as an environment variable. For example from
 * 'trello.card' to 'TRELLO_CARD'.
 * @param name The lowercase name to be converted
 * @returns Name formatted as an uppercase BASH environment variable.
 */
export const asEnvironmentVariableName = (name: string) => name.toUpperCase().replace('.', '_')
