import { installGlobals } from "@remix-run/node"
import { PrismaClient } from "@prisma/client"
import type { TaskContext, Test, TestContext, TestFunction } from "vitest"
import path, { join } from "path"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { randomUUID } from "crypto"
import { TestIdGenerator } from "./TestIdGenerator"
import type { AwilixContainer } from "awilix"
import type { ContainerDependencies } from "@/api/index.server";
import { getContainer } from "@/api/index.server"

const env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ""

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = join(__dirname, `../.env${env}`)

dotenv.config({ path: envPath })

const prisma = new PrismaClient()

installGlobals()

export const integrationTestFunction = (
  testFunction: TestFunction<{ identifiant: string; testIdGenerator: TestIdGenerator, container: AwilixContainer<ContainerDependencies> }>
): TestFunction<{ identifiant: string; testIdGenerator: TestIdGenerator }> => {
  let identifiant: string
  let testIdGenerator: TestIdGenerator
  let innerContainer: AwilixContainer<ContainerDependencies>

  const clearDatabase = async (correlationId: string) => {
    const whereCorrelationId = {
      where: {
        correlationId
      }
    }

    await prisma.user.deleteMany(whereCorrelationId)
    await prisma.serieExerciceSeance.deleteMany(whereCorrelationId)
    await prisma.exerciceSeance.deleteMany(whereCorrelationId)
    await prisma.seance.deleteMany(whereCorrelationId)
    await prisma.exercice.deleteMany(whereCorrelationId)
    await prisma.serieEntrainement.deleteMany(whereCorrelationId)
    await prisma.exerciceEntrainement.deleteMany(whereCorrelationId)
    await prisma.entrainement.deleteMany(whereCorrelationId)
    await prisma.sportifEvenement.deleteMany(whereCorrelationId)

    vi.restoreAllMocks()
  }

  return async (testContext: TaskContext<Test<{}>> & TestContext) => {
    identifiant = randomUUID()
    testIdGenerator = new TestIdGenerator({ identifiant })
    innerContainer = getContainer()

    try {
      const test = await testFunction({ ...testContext, identifiant, testIdGenerator, container: innerContainer })
      await clearDatabase(innerContainer.resolve('correlationIdService').correlationId)
      return test
    } catch(error) {
      await clearDatabase(innerContainer.resolve('correlationIdService').correlationId)
      throw error
    }


  }
}
