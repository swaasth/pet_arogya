import { NextResponse } from 'next/server'
import sql from 'mssql'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
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

    const pool = await sql.connect(connectionString);
    
    const result = await pool.request()
      .input('profileId', sql.UniqueIdentifier, session.user.profileId)
      .query(`
        SELECT 
          d.DogID, 
          d.Name, 
          d.Breed, 
          d.DOB, 
          d.Gender, 
          d.ColorMarkings,
          d.MicrochipID
        FROM Dogs d
        JOIN Dogs_Owners do ON d.DogID = do.dog_id
        WHERE do.owner_id = @profileId
      `);

    await pool.close();

    // Return empty array if no dogs found
    return NextResponse.json({ 
      dogs: result.recordset || [] 
    });
  } catch (error) {
    console.error('Failed to fetch dogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dogs', details: error.message },
      { status: 500 }
    );
  }
} 