
export const findReferences = (source: string) => 
  Array.from(new Set(source.match(/{{.+?}}/g))).map(variable => variable.match(/{{(.+?)}}/)[1])
