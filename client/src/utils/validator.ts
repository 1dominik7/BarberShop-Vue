import type { Barber, Service } from '@/types/types'
import * as yup from 'yup'

export interface NewUser {
  name: string
  email: string
  password: string
}

export interface SignInUser {
  email: string
  password: string
}


export const newUserSchema = yup.object<NewUser>().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
})

export const signInSchema = yup.object<SignInUser>().shape({
  email: yup.string().email('Invalid email or password').required('Email is required'),
  password: yup.string().required('Invalid email or password')
})

export const serviceValidator = yup.object<Service>().shape({
  name: yup.string().required('Name is required'),
  duration: yup
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .required('Duration is required'),
  price: yup.number().min(0, 'Price must be a positive number').required('Price is required'),
  shortcut: yup.string().required('Shortcut is required')
})

export const barberValidator = yup.object<Barber>().shape({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^\d{9}$/, 'Phone number must be exactly 9 digits')
    .transform((value) => (value ? value.replace(/\D/g, '') : null))
})

interface ValidationError {
  name: string
  errors: yup.ValidationError[]
}

export async function yupValidate<T>(schema: yup.Schema<T>, data: T): Promise<void> {
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw { name: 'ValidationError', errors: error.inner } as ValidationError
    }
    throw error
  }
}
