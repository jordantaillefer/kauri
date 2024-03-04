import type { User as UserModel } from "@prisma/client"

import { prisma } from "@/api/db/prisma"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { LUtilisateurNExistePasError } from "../../domain/errors/LUtilisateurNExistePasError"
import type { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"
import { CorrelationIdService } from "@/api/CorrelationIdService"
import { UUID } from "node:crypto"

export class PrismaCompteUtilisateurRepository implements CompteUtilisateurRepository {
  private readonly correlationId: UUID
  constructor({ correlationIdService }: { correlationIdService: CorrelationIdService }) {
    this.correlationId = correlationIdService.correlationId
  }
  async creerCompteUtilisateur(compteUtilisateur: CompteUtilisateur): Promise<CompteUtilisateur> {
    const compteUtilisateurASauvegarder = convertirEnCompteUtilisateurModel(compteUtilisateur)
    const compteUtilisateurModel = await prisma.user.create({
      data: { ...compteUtilisateurASauvegarder, correlationId: this.correlationId }
    })
    return convertirEnCompteUtilisateur(compteUtilisateurModel)
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

function convertirEnCompteUtilisateurModel(compteUtilisateur: CompteUtilisateur): Omit<UserModel, 'correlationId'> {
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
