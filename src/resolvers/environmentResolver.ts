
const asEnvironmentVariableName = (name: string) => name.toUpperCase().replace('.', '_')

const environmentResolver = (name: string) => {
  return process.env[name] || process.env[asEnvironmentVariableName(name)]
}

export default environmentResolver
