export interface Dog {
  DogID: string;
  Name: string;
  Breed: string;
  DOB: string;
  Gender: string;
  ColorMarkings: string;
  MicrochipID: string;
  owner_name?: string;
  owner_contact?: string;
}

export interface Owner {
  owner_id: string;
  owner_name: string;
  owner_contact: string;
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