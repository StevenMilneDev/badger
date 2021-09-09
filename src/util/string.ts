
export const replaceAll = (source: string, token: string, value: string) => {
  let result = source

  while(result.includes(token)) {
    result = result.replace(token, value)
  }

  return result
}
