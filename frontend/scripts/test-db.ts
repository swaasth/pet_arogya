import { PrismaClient } from '@prisma/client'

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

  try {
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('Database connection successful!')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    console.log('Current user count:', userCount)
    
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 