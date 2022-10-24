import type { User as UserModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { LUtilisateurNExistePasError } from "../../domain/errors/LUtilisateurNExistePasError"
import { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"

export class PrismaCompteUtilisateurRepository implements CompteUtilisateurRepository {
  async creerCompteUtilisateur(compteUtilisateur: CompteUtilisateur): Promise<CompteUtilisateur> {
    console.log(compteUtilisateur)
    const compteUtilisateurASauvegarder = convertirEnCompteUtilisateurModel(compteUtilisateur)
    console.log(compteUtilisateurASauvegarder)
    const compteUtilisateurModel = await prisma.user.create({ data: compteUtilisateurASauvegarder })
    console.log(compteUtilisateurModel)
    return convertirEnCompteUtilisateur(compteUtilisateurModel)
  }

  async recupererCompteUtilisateurParId(compteUtilisateurId: string): Promise<CompteUtilisateur> {
    console.log(compteUtilisateurId)
    const compteUtilisateurModel = await prisma.user.findUnique({ where: { id: compteUtilisateurId } })
    if (compteUtilisateurModel === null) {
      throw new LUtilisateurNExistePasError()
    }
    return convertirEnCompteUtilisateur(compteUtilisateurModel)
  }
}

function convertirEnCompteUtilisateurModel(compteUtilisateur: CompteUtilisateur): UserModel {
  return { id: compteUtilisateur.id }
}

function convertirEnCompteUtilisateur(compteUtilisateurModel: UserModel) {
  return CompteUtilisateur.creerCompteUtilisateur({ id: compteUtilisateurModel.id })
}
