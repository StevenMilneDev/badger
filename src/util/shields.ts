
export interface Shield {
  label: string
  message: string
  options: Record<string, string>
}

const STATIC_ENDPOINT = `https://img.shields.io/static/v1`

const encode = encodeURIComponent

const optionsToString = (options: Record<string, string>) => Object.getOwnPropertyNames(options)
  .map(option => `&${encode(option)}=${encode(options[option])}`)
  .join('')

export const getStaticUrl = ({ label, message, options }: Shield) =>
  `${STATIC_ENDPOINT}?label=${encode(label)}&message=${encode(message)}${optionsToString(options)}`
