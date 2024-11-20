import { prisma } from '../src/lib/prisma'
import { execSync } from 'child_process'

async function initDatabase() {
  try {
    console.log('Checking database connection...')
    await prisma.$connect()
    
    console.log('Running Prisma migrations...')
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' })
    
    console.log('Seeding initial data...')
    // Add any initial data seeding here
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase() 