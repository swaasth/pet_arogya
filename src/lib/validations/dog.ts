import * as z from 'zod'

export const dogSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  breed: z
    .string()
    .min(1, 'Breed is required')
    .max(50, 'Breed must be less than 50 characters'),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  gender: z.enum(['male', 'female']),
  colorMarkings: z
    .string()
    .max(100, 'Color & markings must be less than 100 characters')
    .nullable()
    .optional(),
  microchipId: z
    .string()
    .max(50, 'Microchip ID must be less than 50 characters')
    .nullable()
    .optional(),
  medicalNotes: z
    .string()
    .max(1000, 'Medical notes must be less than 1000 characters')
    .nullable()
    .optional(),
})

export type DogFormData = z.infer<typeof dogSchema> 