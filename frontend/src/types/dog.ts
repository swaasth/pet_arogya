export interface Dog {
  DogID: number;
  Name: string;
  Breed: string;
  DOB: string;
  Gender: string;
  ColorMarkings?: string;
  MicrochipID?: string;
  MedicalNotes?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Owner {
  owner_id: string;
  owner_name: string;
  owner_contact: string;
}

export interface Vaccination {
  id: number;
  vaccineName: string;
  dateAdministered: string;
  nextDue: string;
  administeredBy: string;
  notes?: string;
}

export interface DewormingRecord {
  id: number;
  medicationName: string;
  dateAdministered: string;
  nextDue: string;
  administeredBy: string;
  notes?: string;
} 