export type Barber = {
  _id: string
  name: string
  phone: string
  photo: string
  services: Service[]
  availability: AvailabilitySlot[]
  appointments: Appointment[]
}

export interface DayInfo {
  dayOfWeek: string
  dayOfMonth: number
  month: string
  availableHours: string[]
}

export interface Review {
  _id?: string
  user: User
  barber: string
  rating: number
  comment: string
  createdAt: string
}

export type User = {
  _id: string
  name: string
  email: string
  photo: string
  phone: string
  isAdmin: boolean
}

export type AuthUser = {
  _id: string
  appointmentDate: string
  barber: Barber
  createdAt: string
  endTime: string
  services: Service[]
  startTime: string
  status: string
  updatedAt: string
  user: string
}

export type Appointment = {
  _id: string
  user: User
  barber: Barber
  services: Service[]
  appointmentDate: Date
  startTime: string
  endTime: string
  status: string
}

export interface Appointments {
  _id: string
  barber: string
  appointmentDate: string
  endTime: string
  startTime: string
  status: string
  services: Service[]
  user: User
}

export interface Service {
  _id?: string
  name: string
  duration: number
  price: number
  shortcut: string
}

export interface ServiceErrorMessage {
  name: string
  duration: string
  price: string
  shortcut: string
}

export interface AvailabilitySlot {
  _id?: string
  date: string
  startTime: string
  endTime: string
}

export interface BarberErrorMessage {
  name: string
  phone: string
}
