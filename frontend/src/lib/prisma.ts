import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  })

// Simpler error handling middleware
prisma.$use(async (params, next) => {
  try {
    const result = await next(params)
    return result
  } catch (error: any) {
    console.error('Database Error:', {
      model: params.model,
      action: params.action,
      error: error.message
    })
    throw error
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 