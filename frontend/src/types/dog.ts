export interface Dog {
  id: string;
  name: string;
  breed: string;
  dateOfBirth: string;
  ownerId: string;
  medicalNotes?: string;
}

export interface Vaccination {
  id: string;
  dogId: string;
  vaccineName: string;
  dateAdministered: string;
  nextDue: string;
}

export interface DewormingRecord {
  id: string;
  dogId: string;
  medicationName: string;
  dateAdministered: string;
  nextDue: string;
} 