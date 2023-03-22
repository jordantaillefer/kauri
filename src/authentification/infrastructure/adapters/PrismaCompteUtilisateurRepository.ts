import type { User as UserModel } from "@prisma/client";

import { prisma } from "../../../db/prisma";
import { CompteUtilisateur } from "../../domain/CompteUtilisateur";
import { LUtilisateurNExistePasError } from "../../domain/errors/LUtilisateurNExistePasError";
import { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository";

export class PrismaCompteUtilisateurRepository
  implements CompteUtilisateurRepository
{
  async creerCompteUtilisateur(
    compteUtilisateur: CompteUtilisateur
  ): Promise<CompteUtilisateur> {
    const compteUtilisateurASauvegarder =
      convertirEnCompteUtilisateurModel(compteUtilisateur);
    const compteUtilisateurModel = await prisma.user.create({
      data: compteUtilisateurASauvegarder,
    });
    return convertirEnCompteUtilisateur(compteUtilisateurModel);
  }

  async recupererCompteUtilisateurParId(
    compteUtilisateurId: string
  ): Promise<CompteUtilisateur> {
    const compteUtilisateurModel = await prisma.user.findUnique({
      where: { id: compteUtilisateurId },
    });
    if (compteUtilisateurModel === null) {
      throw new LUtilisateurNExistePasError();
    }
    return convertirEnCompteUtilisateur(compteUtilisateurModel);
  }
}

function convertirEnCompteUtilisateurModel(
  compteUtilisateur: CompteUtilisateur
): UserModel {
  return { id: compteUtilisateur.id, createdAt: null, updatedAt: null }; // move this to domain
}

function convertirEnCompteUtilisateur(compteUtilisateurModel: UserModel) {
  return CompteUtilisateur.creerCompteUtilisateur({
    id: compteUtilisateurModel.id,
  });
}
