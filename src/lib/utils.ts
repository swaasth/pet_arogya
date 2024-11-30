import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(dateString: string): string {
  const today = new Date()
  const birthDate = new Date(dateString)
  
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()
  
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--
    months = 12 + months
  }
  
  if (years < 1) {
    return months === 1 ? '1 month' : `${months} months`
  }
  
  return years === 1 ? '1 year' : `${years} years`
}
