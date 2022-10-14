import "reflect-metadata"

export const ProduceApiResponse = (): MethodDecorator =>
  <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
    Reflect.defineMetadata(propertyKey, true, target, propertyKey);
    return target
  }