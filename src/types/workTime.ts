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
