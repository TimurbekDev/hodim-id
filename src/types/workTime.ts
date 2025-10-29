export interface IWorkTime {
  id: number
  start_time: string
  end_time: string
  arrived_at: string | null
  departed_at: string | null
  arrival_status: number
  departed_status: number
  break_from: string
  break_to: string
}

// Add explicit enums matching the backend C# codes
export enum WorkTimeArrivalStatus {
  // На работе
  AtWork = 1,
  // Опоздал
  Late = 2,
  // Не пришел
  Absent = 20,
  // В отпуске
  OnVacation = 30,
}

export enum WorkTimeDepartureStatus {
  // Отработал
  Worked = 3,
  // Раньше ушел
  LeftEarly = 4,
  // Не пришел
  Absent = 20,
  // В отпуске
  OnVacation = 30,
}

export enum WorkTimeStatus {
  not_arrived = 0,
  arrived_not_deported = 1,
  arrived_and_deported = 2
}