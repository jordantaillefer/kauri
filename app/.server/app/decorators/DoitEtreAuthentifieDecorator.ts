import "reflect-metadata"

export const DoitEtreAuthentifie = (): MethodDecorator =>
  <T>(target: Object, propertyKey: string | symbol): TypedPropertyDescriptor<T> => {
    Reflect.defineMetadata("doitEtreAuthentifie", true, target, propertyKey)
    return target
  }
