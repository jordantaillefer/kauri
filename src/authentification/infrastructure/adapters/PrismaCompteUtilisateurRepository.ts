import type { User as UserModel } from "@prisma/client"

import { prisma } from "../../../db/prisma"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"
import { LUtilisateurNExistePasError } from "../../domain/errors/LUtilisateurNExistePasError"

export class PrismaCompteUtilisateurRepository implements CompteUtilisateurRepository {
  async creerCompteUtilisateur(compteUtilisateur: CompteUtilisateur): Promise<CompteUtilisateur> {
    const compteUtiliteurASauvegarder = convertirEnCompteUtilisateurModel(compteUtilisateur)
    const compteUtilisateurModel = await prisma.user.create({ data: compteUtiliteurASauvegarder })
    return convertirEnCompteUtilisateur(compteUtilisateurModel)
  }

  async recupererCompteUtilisateurParId(compteUtilisateurId: string): Promise<CompteUtilisateur> {
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
  return CompteUtilisateur.creerCompteUtilisateur(compteUtilisateurModel.id)
}
