import "reflect-metadata"

import { DomainError } from "./DomainError"

export const Controller = (): ClassDecorator =>
  (target: Function) => {
    // Iterate over class properties except constructor
    for (const propertyName of Reflect.ownKeys(target.prototype).filter(prop => prop !== "constructor")) {
      const desc = Object.getOwnPropertyDescriptor(target.prototype, propertyName)!
      const isMethod = desc.value instanceof Function
      const isProducingApiResponse = Reflect.getMetadata(propertyName, target.prototype, propertyName)
      if (!isMethod || !isProducingApiResponse) continue
      Object.defineProperty(target.prototype, propertyName, _generateDescriptor(desc))
    }
  }

function _generateDescriptor(
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  // Save a reference to the original method
  const originalMethod = descriptor.value
  // Rewrite original method with try/catch wrapper
  descriptor.value = function(...args: any[]) {
    try {
      const result = originalMethod.apply(this, args)

      // Check if method is asynchronous
      if (result && result instanceof Promise) {
        // Return promise
        return result.catch((error: unknown) => _handleError(error as DomainError))
      }
      // Return actual result
      return result
    } catch (error: unknown) {
      _handleError(error as DomainError)
    }
  }
  return descriptor
}

function _handleError(error: DomainError) {
  return {
    reasonPhrase: error.reason,
    data: error.message
  }
}
