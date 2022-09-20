import { installGlobals } from "@remix-run/node";
import "@testing-library/jest-dom/extend-expect";
import { PrismaClient } from '@prisma/client'
import { afterEach } from "vitest"

require('dotenv').config()

const prisma = new PrismaClient();

installGlobals();

afterEach(async () => {
  await prisma.user.deleteMany()
})