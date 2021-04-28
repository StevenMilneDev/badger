import _ from 'lodash'

export const findReferences = (source: string) => 
  _.uniq(source.match(/{{.+?}}/g)).map(variable => variable.match(/{{(.+?)}}/)[1])
