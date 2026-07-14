import { getInput } from '@actions/core'
import { getBadgeConfigs, MAX_BADGES } from './actions'
import { mockify } from './testUtil'

jest.mock('@actions/core')

const makeInputs = (start: number = 1, end: number = MAX_BADGES) => {
  const inputs: Record<string, string> = {}

  for(let i = start; i <= end; i++) {
    const index = i < 10 ? `0${i}` : i

    inputs[`badge-${index}`] = i.toString(10)
  }

  return inputs
}

describe('Get Badge Configs', () => {
  it('should return all inputs', () => {
    const inputs = makeInputs(0, MAX_BADGES + 1)  // Make extra inputs to make sure only MAX_BADGES are returned
    mockify(getInput).mockImplementation((name: string) => inputs[name])

    const result = getBadgeConfigs()

    expect(result.length).toBe(MAX_BADGES)

    for(let i = 0; i < MAX_BADGES; i++) {
      expect(result[i]).toBe((i + 1).toString(10))
    }
  })

  it('should return empty configs', () => {
    const inputs = makeInputs()
    mockify(getInput).mockImplementation((name: string) => inputs[name])

    inputs[`badge-02`] = undefined
    inputs[`badge-05`] = undefined
    inputs[`badge-08`] = undefined
    inputs[`badge-12`] = undefined

    const result = getBadgeConfigs()

    expect(result.length).toBe(MAX_BADGES)
    expect(result[0]).toBe('1')
    expect(result[1]).toBe(undefined)
    expect(result[2]).toBe('3')
    expect(result[3]).toBe('4')
    expect(result[4]).toBe(undefined)
    expect(result[5]).toBe('6')
    expect(result[6]).toBe('7')
    expect(result[7]).toBe(undefined)
    expect(result[8]).toBe('9')
    expect(result[9]).toBe('10')
    expect(result[10]).toBe('11')
    expect(result[11]).toBe(undefined)
    expect(result[12]).toBe('13')
    expect(result[13]).toBe('14')
    expect(result[14]).toBe('15')
  })
})