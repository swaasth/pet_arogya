import { Dog as PrismaDog, Vaccination as PrismaVaccination, Deworming, User } from '@prisma/client'

// Extend the Prisma types with any additional properties needed
export interface Dog extends PrismaDog {
  owners?: {
    owner: User;
  }[];
}

export interface Vaccination extends PrismaVaccination {
  dog?: Dog;
}

export interface DewormingRecord extends Deworming {
  dog?: Dog;
}

export interface Owner extends User {
  dogs?: {
    dog: Dog;
  }[];
} 