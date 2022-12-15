
/**
 * Resolves the value for a given name. If a value cannot be resolved then
 * undefined is returned.
 */
export type Resolver<T> = (name: string) => T | undefined

/**
 * Provides an in memory cachinig mechanism. When queried for a value by name,
 * it will return a cached value if present. If no value is cached by the
 * given name then the resolver will be called to retrieve a value. Any values
 * returned by the resolver will be cached for future queries.
 */
export default class Cache<T> {
  private readonly resolver: Resolver<T>
  private values: Record<string, T>

  constructor(resolver: Resolver<T>) {
    this.resolver = resolver
    this.values = {}
  }

  /**
   * Gets a value from the cache. If no value is cached then the resolver will
   * be queried instead.
   * @param name The name of the value to retrieve
   * @returns The value retrieved from the cache
   */
  public get(name: string): T | undefined {
    if (this.values[name]) {
      return this.values[name]
    }

    const value = this.resolver(name)
    if (value) {
      this.values[name] = value
      return value
    }

    return undefined
  }
}

/**
 * Generates a simple resolver which uses an object as its data source.
 * @param obj The source object
 * @returns The generated object resolver
 */
export const objectResolver = <T>(obj: Record<string, T>) => (name: string) => {
  return obj[name]
}

/**
 * Generates a resolver which uses multiple resolvers as its data source. When
 * invoked, it will call each resolver in order until one returns a value.
 * @param resolvers 
 * @returns 
 */
export const chainedResolver = <T>(resolvers: Resolver<T>[]) => (name: string) => {
  for (const resolver of resolvers) {
    const value = resolver(name)

    if (value) {
      return value
    }
  }

  return undefined
}