import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import sql from 'mssql'

async function resetDatabase() {
  try {
    // First, connect to SQL Server to drop existing tables
    const connectionString = 
      `Server=tcp:${process.env.AZURE_SQL_SERVER},${process.env.AZURE_SQL_PORT};` +
      `Initial Catalog=${process.env.AZURE_SQL_DATABASE};` +
      `User ID=${process.env.AZURE_SQL_USER};` +
      `Password=${process.env.AZURE_SQL_PASSWORD};` +
      `Encrypt=True;` +
      `TrustServerCertificate=True;`

    // Connect to SQL Server
    const pool = await sql.connect(connectionString)

    try {
      // Drop tables in correct order
      await pool.request().query(`
        -- Drop foreign key constraints first
        DECLARE @sql NVARCHAR(MAX) = '';
        SELECT @sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id))
          + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) 
          + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
        FROM sys.foreign_keys;
        EXEC sp_executesql @sql;

        -- Now drop the tables in correct order
        DROP TABLE IF EXISTS [dbo].[Vaccinations];
        DROP TABLE IF EXISTS [dbo].[Deworming];
        DROP TABLE IF EXISTS [dbo].[Dogs_Owners];
        DROP TABLE IF EXISTS [dbo].[Dogs];
        DROP TABLE IF EXISTS [dbo].[Users];
      `)

      console.log('Successfully dropped existing tables')

      // Now use Prisma to recreate the schema
      const prisma = new PrismaClient()
      
      try {
        await prisma.$executeRawUnsafe('SELECT 1')
        console.log('Database connection successful')
        
        // Push the new schema
        execSync('npx prisma db push', { stdio: 'inherit' })
        
        console.log('Successfully recreated database schema')
      } finally {
        await prisma.$disconnect()
      }

    } finally {
      await pool.close()
    }

  } catch (error) {
    console.error('Error resetting database:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

resetDatabase()