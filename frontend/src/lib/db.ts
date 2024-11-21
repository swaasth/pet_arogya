import { prisma } from './prisma'

export async function getDbConnection() {
  return prisma
}