import { getDbConnection } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { dogId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = await getDbConnection()
    const transaction = await pool.transaction()

    try {
      // Delete related records first
      await transaction.request()
        .input('dogId', params.dogId)
        .query(`
          DELETE FROM Vaccinations WHERE DogID = @dogId;
          DELETE FROM Deworming WHERE DogID = @dogId;
          DELETE FROM Dogs_Owners WHERE DogID = @dogId;
          DELETE FROM Dogs WHERE DogID = @dogId;
        `)

      await transaction.commit()
      return NextResponse.json({ success: true })
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete dog' },
      { status: 500 }
    )
  }
} 