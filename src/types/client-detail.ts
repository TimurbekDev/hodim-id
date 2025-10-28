export interface Client {
  full_name: string
  position: string
  image_url: string
  schedule: Schedule[]
  discipline: Discipline
}

export interface Schedule {
  id: number
  name: string
  organizationUserId: number
  startTime: string
  endTime: string
  breakTo: string
  breakFrom: string
  workDays: number[]
}

export interface Discipline {
  on_time: number
  late: number
  absent: number
  left_early: number
}
