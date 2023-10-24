import "reflect-metadata"

export const ProduceServerResponse = (): MethodDecorator =>
  <T>(target: Object, propertyKey: string | symbol): TypedPropertyDescriptor<T> => {
    Reflect.defineMetadata("produceServerResponse", true, target, propertyKey)
    return target
  }
