import { Dog, Vaccination, DewormingRecord, Appointment } from '@/types/dog'

export const mockDogs: Dog[] = [
  {
    id: '1',
    name: 'Max',
    breed: 'German Shepherd',
    dateOfBirth: '2020-03-15',
    ownerId: 'owner1',
    medicalNotes: 'Allergic to chicken',
  },
  {
    id: '2',
    name: 'Bella',
    breed: 'Labrador Retriever',
    dateOfBirth: '2021-06-22',
    ownerId: 'owner1',
  },
  {
    id: '3',
    name: 'Charlie',
    breed: 'Golden Retriever',
    dateOfBirth: '2019-12-10',
    ownerId: 'owner2',
    medicalNotes: 'Hip dysplasia history',
  },
]

export const mockVaccinations: Vaccination[] = [
  {
    id: '1',
    dogId: '1',
    vaccineName: 'Rabies',
    dateAdministered: '2023-01-15',
    nextDue: '2024-01-15',
  },
  {
    id: '2',
    dogId: '1',
    vaccineName: 'DHPP',
    dateAdministered: '2023-03-20',
    nextDue: '2024-03-20',
  },
]

export const mockDewormingRecords: DewormingRecord[] = [
  {
    id: '1',
    dogId: '1',
    medicationName: 'Heartgard Plus',
    dateAdministered: '2024-02-01',
    nextDue: '2024-03-01',
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    dogId: '1',
    type: 'checkup',
    date: '2024-03-20T10:00:00',
    notes: 'Regular checkup',
    status: 'scheduled',
  },
  {
    id: '2',
    dogId: '2',
    type: 'vaccination',
    date: '2024-03-22T14:30:00',
    notes: 'DHPP vaccination due',
    status: 'scheduled',
  },
] 