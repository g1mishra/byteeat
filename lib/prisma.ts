import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient
interface CustomGlobal {
  prisma?: PrismaClient
}

// Augment global to include the custom global object
declare const global: CustomGlobal

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
