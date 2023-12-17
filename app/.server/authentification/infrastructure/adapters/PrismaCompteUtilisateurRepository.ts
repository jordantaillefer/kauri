import type { User as UserModel } from "@prisma/client"

import { prisma } from "@/api/db/prisma"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { LUtilisateurNExistePasError } from "../../domain/errors/LUtilisateurNExistePasError"
import type { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"

export class PrismaCompteUtilisateurRepository implements CompteUtilisateurRepository {
  async creerCompteUtilisateur(compteUtilisateur: CompteUtilisateur): Promise<CompteUtilisateur> {
    console.log("repo1")
    const compteUtilisateurASauvegarder = convertirEnCompteUtilisateurModel(compteUtilisateur)
    try {
      console.log("repo2")
      const compteUtilisateurModel = await prisma.user.create({
        data: compteUtilisateurASauvegarder
      })
      console.log("repo3")
      return convertirEnCompteUtilisateur(compteUtilisateurModel)
    } catch (e) {
      console.log("tototototo")
      console.log(e)
    }
  }

  async recupererCompteUtilisateurParId(compteUtilisateurId: string): Promise<CompteUtilisateur> {
    const compteUtilisateurModel = await prisma.user.findUnique({
      where: { id: compteUtilisateurId }
    })
    if (compteUtilisateurModel === null) {
      throw new LUtilisateurNExistePasError()
    }
    return convertirEnCompteUtilisateur(compteUtilisateurModel)
  }
}

function convertirEnCompteUtilisateurModel(compteUtilisateur: CompteUtilisateur): UserModel {
  return {
    id: compteUtilisateur.id,
    nom: compteUtilisateur.nom,
    prenom: compteUtilisateur.prenom,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function convertirEnCompteUtilisateur(compteUtilisateurModel: UserModel) {
  return CompteUtilisateur.creerCompteUtilisateur({
    id: compteUtilisateurModel.id,
    nom: compteUtilisateurModel.nom,
    prenom: compteUtilisateurModel.prenom
  })
}
