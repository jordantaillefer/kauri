import { CompteUtilisateurRepository } from "./CompteUtilisateurRepository"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"

import type { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

export class PrismaCompteUtilisateurRepository implements CompteUtilisateurRepository {
  private prisma: PrismaClient
  constructor() {
    this.prisma = new PrismaClient()
  }

  async creerCompteUtilisateur(compteUtilisateurId: string): Promise<CompteUtilisateur> {
    const createdUser = await this.prisma.user.create({ data: { id: compteUtilisateurId }})
    return PrismaCompteUtilisateurRepository.convertirEnCompteUtilisateur(createdUser)
  }

  async recupererCompteUtilisateur(compteUtilisateurId: string): Promise<CompteUtilisateur> {
    const user = await this.prisma.user.findUnique({ where: { id: compteUtilisateurId }})
    // @ts-ignore
    return PrismaCompteUtilisateurRepository.convertirEnCompteUtilisateur(user);
  }

  private static convertirEnCompteUtilisateur(user: User) {
    return CompteUtilisateur.creerCompteUtilisateur(user.id)
  }
}