import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

async function cleanupDatabase() {
  const prisma = new PrismaClient()
  
  try {
    // Delete all records in reverse order of dependencies
    await prisma.vaccination.deleteMany()
    await prisma.deworming.deleteMany()
    await prisma.dogsOwners.deleteMany()
    await prisma.dog.deleteMany()
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()
    await prisma.breeds.deleteMany()

    console.log('Database cleaned successfully')

    // Reset auto-increment counters if any
    await prisma.$executeRaw`DBCC CHECKIDENT ('Vaccinations', RESEED, 0)`
    await prisma.$executeRaw`DBCC CHECKIDENT ('Deworming', RESEED, 0)`

    console.log('Auto-increment counters reset')

  } catch (error) {
    console.error('Error cleaning database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDatabase() 