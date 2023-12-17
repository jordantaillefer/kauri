import { PrismaClient } from "@prisma/client"

import config from "../../../config.server"

let prisma: PrismaClient

declare global {
  var __db: PrismaClient | undefined
}

if (config.env === "production") {
  prisma = new PrismaClient()
  prisma.$connect()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
    global.__db.$connect()
  }
  prisma = global.__db
}

export { prisma }
