import { getStaticUrl, SHIELDS_IO_ENDPOINT } from "./shields"

describe('Get Static URL', () => {
  it('should return simple shield URL without options', () => {
    const url = getStaticUrl({ label: 'My Badge', message: 'My Message', options: {} })

    expect(url).toEqual(`${SHIELDS_IO_ENDPOINT}?label=My%20Badge&message=My%20Message`)
  })

  it('should support options', () => {
    const options = { logo: 'google-chrome', logoColor: 'white' }
    const url = getStaticUrl({ label: 'My Badge', message: 'My Message', options })

    expect(url).toEqual(`${SHIELDS_IO_ENDPOINT}?label=My%20Badge&message=My%20Message&logo=google-chrome&logoColor=white`)
  })
})