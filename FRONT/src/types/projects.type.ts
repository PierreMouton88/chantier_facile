import type { Address } from "./address.type"
import type { Task } from "./task.type"

export type EntrepriseProject = {
  id: number
  entreprise_id: number
  tasks: Task[]
}

export type Project = {
  id: number
  title: string
  description: string
  start_date: string
  end_date?: string
  address_id: number
  customer_id: number
  is_finished: boolean
  address?: Address
  entreprises?: EntrepriseProject[]
}
