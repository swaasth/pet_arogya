import { NextResponse } from 'next/server'
import { sendAppointmentReminders } from '@/lib/reminder-service'

export async function GET(request: Request) {
  try {
    // Verify cron job secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await sendAppointmentReminders()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Reminder cron job failed:', error)
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    )
  }
} 