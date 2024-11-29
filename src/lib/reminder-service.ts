import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'
import { addDays, format } from 'date-fns'

const resend = new Resend(process.env.RESEND_API_KEY)
const prisma = new PrismaClient()

export async function sendAppointmentReminders() {
  try {
    // Get appointments for tomorrow
    const tomorrow = addDays(new Date(), 1)
    const appointments = await prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: tomorrow,
          lt: addDays(tomorrow, 1)
        },
        status: 'scheduled'
      },
      include: {
        dog: {
          include: {
            owners: {
              include: {
                owner: true
              }
            }
          }
        },
        vet: true
      }
    })

    // Send reminders for each appointment
    for (const appointment of appointments) {
      const ownerEmails = appointment.dog.owners.map(
        (owner) => owner.owner.email
      )

      await resend.emails.send({
        from: 'noreply@yourvetclinic.com',
        to: ownerEmails,
        subject: 'Appointment Reminder',
        html: `
          <h1>Appointment Reminder</h1>
          <p>This is a reminder for your appointment tomorrow:</p>
          <ul>
            <li>Pet: ${appointment.dog.name}</li>
            <li>Date: ${format(appointment.dateTime, 'PPP')}</li>
            <li>Time: ${format(appointment.dateTime, 'p')}</li>
            <li>Type: ${appointment.type}</li>
            <li>Veterinarian: Dr. ${appointment.vet.full_name}</li>
          </ul>
          <p>If you need to reschedule, please contact us as soon as possible.</p>
        `
      })
    }

    return { success: true, count: appointments.length }
  } catch (error) {
    console.error('Error sending reminders:', error)
    throw error
  }
} 