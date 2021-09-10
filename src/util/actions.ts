import { getInput } from '@actions/core'

/**
 * Gets badge configuration strings from the GitHub Action inputs.
 * @returns Array of badge configuration strings
 */
 export const getBadgeConfigs = () => {
  const configs: Array<string | undefined> = []

  for (let i = 1; i <= 10; i++) {
    const index = i < 10 ? `0${i}` : i
    const input = getInput(`badge-${index}`)
  
    configs.push(input || undefined)
  }

  return configs
}