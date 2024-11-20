import { getDbConnection } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { dogId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = await getDbConnection()
    
    const result = await pool.request()
      .input('dogId', params.dogId)
      .query(`
        SELECT 
          DewormingID as id,
          MedicineName as medicationName,
          DateAdministered as dateAdministered,
          NextDueDate as nextDue,
          AdministeredBy as administeredBy,
          Notes as notes
        FROM Deworming
        WHERE DogID = @dogId
        ORDER BY DateAdministered DESC
      `)

    return NextResponse.json(result.recordset)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch deworming records' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { dogId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { medicineName, dateAdministered, nextDueDate, administeredBy, notes } = await request.json()

    const pool = await getDbConnection()
    
    const result = await pool.request()
      .input('dogId', params.dogId)
      .input('medicineName', medicineName)
      .input('dateAdministered', dateAdministered)
      .input('nextDueDate', nextDueDate)
      .input('administeredBy', administeredBy)
      .input('notes', notes)
      .query(`
        INSERT INTO Deworming (
          DogID,
          MedicineName,
          DateAdministered,
          NextDueDate,
          AdministeredBy,
          Notes
        )
        VALUES (
          @dogId,
          @medicineName,
          @dateAdministered,
          @nextDueDate,
          @administeredBy,
          @notes
        )
      `)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add deworming record' },
      { status: 500 }
    )
  }
} 