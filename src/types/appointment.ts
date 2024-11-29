export interface Appointment {
  id: string
  dogId: string
  type: 'checkup' | 'vaccination' | 'grooming' | 'other'
  date: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
} 