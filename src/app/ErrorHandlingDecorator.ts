import { DomainError } from "./DomainError"

// Decorator factory function
export const Controller = (): any => {
  return (target: any) => {
    // Iterate over class properties except constructor
    for (const propertyName of Reflect.ownKeys(target.prototype).filter(prop => prop !== "constructor")) {
      const desc = Object.getOwnPropertyDescriptor(target.prototype, propertyName)!
      const isMethod = desc.value instanceof Function
      if (!isMethod) continue
      Object.defineProperty(target.prototype, propertyName, _generateDescriptor(desc))
    }
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
  if (error) {
    return {
      reasonPhrase: error.reason,
      data: error.message
    }
  } else {
    throw error
  }
}