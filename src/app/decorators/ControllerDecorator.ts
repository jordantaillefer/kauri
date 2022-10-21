import "reflect-metadata"

import { DataFunctionArgs } from "@remix-run/node"
import { ReasonPhrases } from "http-status-codes"

import {
  LUtilisateurNestPasConnecteError
} from "../../authentification/domains/errors/LUtilisateurNestPasConnecteError"
import { DomainError } from "../errors/DomainError"
import { container } from "api"

export const Controller = (): ClassDecorator =>
  (target: Function) => {
    for (const propertyName of Reflect.ownKeys(target.prototype).filter(prop => prop !== "constructor")) {
      const desc = Object.getOwnPropertyDescriptor(target.prototype, propertyName)!
      const isMethod = desc.value instanceof Function
      const isProducingApiResponse = Reflect.getMetadata(propertyName, target.prototype, propertyName)
      const isAuthentificationRequired = Reflect.getMetadata("doitEtreAuthentifie", target.prototype, propertyName)
      if (isMethod && isProducingApiResponse) {
        Object.defineProperty(target.prototype, propertyName, _generateDescriptor(desc, isAuthentificationRequired))
      }
    }
  }

function _generateDescriptor(
  descriptor: PropertyDescriptor,
  isAuthentificationRequired: boolean
): PropertyDescriptor {
  const originalMethod = descriptor.value as Function
  descriptor.value = async function(args: DataFunctionArgs) {
    try {
      let result: any

      if (isAuthentificationRequired) {
        const sessionManager = await container.resolve("sessionManager")
        const compteUtilisateurRepository = await container.resolve("compteUtilisateurRepository")
        const session = await sessionManager.get(args.request)
        if (!session.has("user")) {
          throw new LUtilisateurNestPasConnecteError()
        }
        result = originalMethod.apply(this, [{
          ...args,
          compteUtilisateurConnecte: await compteUtilisateurRepository.recupererCompteUtilisateurParId(session.get("user").id)
        }])
      } else {
        result = originalMethod.apply(this, [args])
      }

      if (result && result instanceof Promise) {
        return result.catch((error: unknown) => _handleError(error as DomainError))
      }
      return result
    } catch (error: unknown) {
      return _handleError(error as DomainError)
    }
  }
  return descriptor
}

function _handleError(error: DomainError) {
  console.error(error)
  if (error.reasonPhrase) {
    return {
      reasonPhrase: error.reasonPhrase,
      data: error.message
    }
  } else {
    return {
      reasonPhrase: ReasonPhrases.BAD_REQUEST,
      data: error.stack
    }
  }
}
