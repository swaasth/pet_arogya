import { NextResponse } from 'next/server'
import sql from 'mssql'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  let pool: sql.ConnectionPool | null = null;
  
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connectionString = 
      `Server=tcp:${process.env.AZURE_SQL_SERVER},${process.env.AZURE_SQL_PORT};` +
      `Initial Catalog=${process.env.AZURE_SQL_DATABASE};` +
      `User ID=${process.env.AZURE_SQL_USER};` +
      `Password=${process.env.AZURE_SQL_PASSWORD};` +
      `Encrypt=True;` +
      `TrustServerCertificate=False;`;

    pool = await sql.connect(connectionString);

    // Execute all queries in parallel for better performance
    const [dogsResult, vaccinationsResult, dewormingResult] = await Promise.all([
      pool.request()
        .input('profileId', sql.UniqueIdentifier, session.user.profileId)
        .query(`
          SELECT COUNT(*) as totalDogs 
          FROM Dogs d
          JOIN Dogs_Owners do ON d.DogID = do.dog_id
          WHERE do.owner_id = @profileId
        `),

      pool.request()
        .input('profileId', sql.UniqueIdentifier, session.user.profileId)
        .query(`
          SELECT COUNT(*) as upcomingVaccinations
          FROM Vaccinations v
          JOIN Dogs d ON v.dog_id = d.DogID
          JOIN Dogs_Owners do ON d.DogID = do.dog_id
          WHERE do.owner_id = @profileId
          AND v.NextDueDate > GETDATE()
          AND v.NextDueDate <= DATEADD(month, 1, GETDATE())
        `),

      pool.request()
        .input('profileId', sql.UniqueIdentifier, session.user.profileId)
        .query(`
          SELECT COUNT(*) as upcomingDeworming
          FROM Deworming d
          JOIN Dogs dog ON d.dog_id = dog.DogID
          JOIN Dogs_Owners do ON dog.DogID = do.dog_id
          WHERE do.owner_id = @profileId
          AND d.NextDueDate > GETDATE()
          AND d.NextDueDate <= DATEADD(month, 1, GETDATE())
        `)
    ]);

    return NextResponse.json({
      totalDogs: dogsResult.recordset[0].totalDogs,
      upcomingVaccinations: vaccinationsResult.recordset[0].upcomingVaccinations,
      upcomingDeworming: dewormingResult.recordset[0].upcomingDeworming
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.close();
    }
  }
} 