
export const link = (label: string, url: string) => `[${label}](${url})`

export const image = (url: string, alt: string) => `![${alt}](${url})`

export const quote = (text: string) => `> ${text}`

export const list = (items: string[]) => items.map(item => `- ${item}`).join('\n')

export const code = (text: string, type?: string) => `\`\`\`${type ? type : ''}\n${text}\n\`\`\``
