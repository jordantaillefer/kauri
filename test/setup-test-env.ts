import { installGlobals } from "@remix-run/node"
import { PrismaClient } from "@prisma/client"
import type { TaskContext, Test, TestContext, TestFunction } from "vitest"
import path, { join } from "path"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { randomUUID } from "crypto"
import { TestIdGenerator } from "./TestIdGenerator"

const env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ""

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = join(__dirname, `../.env${env}`)

dotenv.config({ path: envPath })

const prisma = new PrismaClient()

installGlobals()

export const integrationTestFunction = (
  testFunction: TestFunction<{ identifiant: string; testIdGenerator: TestIdGenerator }>
): TestFunction<{ identifiant: string; testIdGenerator: TestIdGenerator }> => {
  let identifiant: string
  let testIdGenerator: TestIdGenerator

  beforeEach(() => {
    identifiant = randomUUID()
    testIdGenerator = new TestIdGenerator({ identifiant })
  })

  afterEach(async () => {
    const whereStartId = { // Tout le monde devrait utiliser le where idUtilisateur
      where: {
        id: {
          startsWith: identifiant
        }
      }
    }
    const whereStartIdUtilisateur = {
      where: {
        idUtilisateur: {
          startsWith: identifiant
        }
      }
    }
    await prisma.user.deleteMany(whereStartId)
    await prisma.serieExerciceSeance.deleteMany(whereStartId)
    await prisma.exerciceSeance.deleteMany(whereStartId)
    await prisma.seance.deleteMany(whereStartIdUtilisateur)
    await prisma.exercice.deleteMany(whereStartId)
    await prisma.serieEntrainement.deleteMany(whereStartId)
    await prisma.exerciceEntrainement.deleteMany(whereStartId)
    await prisma.entrainement.deleteMany(whereStartId)
    await prisma.sportifEvenement.deleteMany(whereStartIdUtilisateur)

    vi.restoreAllMocks()
  })

  return (testContext: TaskContext<Test<{}>> & TestContext) => {
    return testFunction({ ...testContext, identifiant, testIdGenerator })
  }
}
