import { Dog } from '@prisma/client'

export interface HealthRecord {
  id: string
  dateAdministered: Date
  nextDueDate: Date
  notes?: string
  administeredBy?: string
}

export interface VaccinationRecord extends HealthRecord {
  vaccineName: string
  dogId: string
}

export interface DewormingData extends HealthRecord {
  medicineName: string
  dogId: string
}

export interface AppointmentData {
  id: string
  dogId: string
  vetId: string
  dateTime: Date
  status: 'scheduled' | 'completed' | 'cancelled'
  type: string
  notes?: string
}

export interface DogWithRecords extends Dog {
  vaccinations: VaccinationRecord[]
  dewormings: DewormingData[]
} 