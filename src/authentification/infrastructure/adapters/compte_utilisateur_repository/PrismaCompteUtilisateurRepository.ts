import type { User as PrismaUser } from '@prisma/client'

import { prisma } from "../../../../db/prisma"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { CompteUtilisateurRepository } from "./CompteUtilisateurRepository"

export class PrismaCompteUtilisateurRepository implements CompteUtilisateurRepository {
  async creerCompteUtilisateur(compteUtilisateur: CompteUtilisateur): Promise<CompteUtilisateur> {
    const compteUtiliteurASauvegarder = convertirEnCompteUtilisateurModel(compteUtilisateur)
    const compteUtilisateurModel = await prisma.user.create({ data: compteUtiliteurASauvegarder})
    return convertirEnCompteUtilisateur(compteUtilisateurModel)
  }

  async recupererCompteUtilisateur(compteUtilisateurId: string): Promise<CompteUtilisateur | null> {
    const compteUtilisateurModel = await prisma.user.findUnique({ where: { id: compteUtilisateurId }})
    return compteUtilisateurModel ? convertirEnCompteUtilisateur(compteUtilisateurModel) : null;
  }

}

function convertirEnCompteUtilisateurModel(compteUtilisateur: CompteUtilisateur): PrismaUser {
  return { id: compteUtilisateur.id }
}

function convertirEnCompteUtilisateur(compteUtilisateurModel: PrismaUser) {
  return CompteUtilisateur.creerCompteUtilisateur(compteUtilisateurModel.id)
}
