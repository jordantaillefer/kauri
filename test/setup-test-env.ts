import { installGlobals } from "@remix-run/node"
import "@testing-library/jest-dom/extend-expect"
import { PrismaClient } from "@prisma/client"
import { afterEach } from "vitest"
import path, { join } from "path"
import dotenv from "dotenv"
import { fileURLToPath } from "url";

const env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ""

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = join(__dirname, `../.env${env}`)

dotenv.config({ path: envPath })

const prisma = new PrismaClient()

installGlobals()

afterEach(async () => {
  await prisma.user.deleteMany()
  await prisma.serieExerciceSeance.deleteMany()
  await prisma.exerciceSeance.deleteMany()
  await prisma.seance.deleteMany()
  await prisma.exercice.deleteMany()
  await prisma.serieEntrainement.deleteMany()
  await prisma.exerciceEntrainement.deleteMany()
  await prisma.entrainement.deleteMany()

  vi.restoreAllMocks()
})
