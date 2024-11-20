import { getDbConnection } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { dogId: string; vaccinationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = await getDbConnection()
    
    await pool.request()
      .input('vaccinationId', params.vaccinationId)
      .input('dogId', params.dogId)
      .query(`
        DELETE FROM Vaccinations 
        WHERE VaccinationID = @vaccinationId 
        AND DogID = @dogId
      `)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete vaccination' },
      { status: 500 }
    )
  }
} 