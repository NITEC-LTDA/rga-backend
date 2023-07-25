import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

beforeAll(async () => {
  const dbName = 'rga_dev_test' // replace with your database name
  try {
    // Try to create the database
    await prisma.$queryRaw(Prisma.sql`CREATE IF NOT EXISTS DATABASE ${dbName};`)
  } catch (e) {
    // If database already exists, an error is thrown
    console.log(`Database ${dbName} already exists.`)
  }
  await prisma.$disconnect()
})
