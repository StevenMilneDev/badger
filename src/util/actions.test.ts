import { getInput } from '@actions/core'
import { getBadgeConfigs } from './actions'
import { mockify } from './testUtil'

jest.mock('@actions/core')

const makeInputs = (start: number = 1, end: number = 10) => {
  const inputs: Record<string, string> = {}

  for(let i = start; i <= end; i++) {
    const index = i < 10 ? `0${i}` : i

    inputs[`badge-${index}`] = i.toString(10)
  }

  return inputs
}

describe('Get Badge Configs', () => {
  it('should return all inputs', () => {
    const inputs = makeInputs(0, 11)  // Make extra inputs to make sure only 10 are returned
    mockify(getInput).mockImplementation((name: string) => inputs[name])

    const result = getBadgeConfigs()

    expect(result.length).toBe(10)

    for(let i = 0; i <= 9; i++) {
      expect(result[i]).toBe((i + 1).toString(10))
    }
  })
  
  it('should return empty configs', () => {
    const inputs = makeInputs()
    mockify(getInput).mockImplementation((name: string) => inputs[name])

    inputs[`badge-02`] = undefined
    inputs[`badge-05`] = undefined
    inputs[`badge-08`] = undefined

    const result = getBadgeConfigs()

    expect(result.length).toBe(10)
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
  })
})