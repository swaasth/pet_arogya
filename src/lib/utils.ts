import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInYears, differenceInMonths } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(dateOfBirth: string | Date): string {
  const dob = new Date(dateOfBirth)
  const now = new Date()
  
  const years = differenceInYears(now, dob)
  if (years > 0) {
    return years === 1 ? '1 year old' : `${years} years old`
  }
  
  const months = differenceInMonths(now, dob)
  if (months > 0) {
    return months === 1 ? '1 month old' : `${months} months old`
  }
  
  return 'Less than a month old'
} 