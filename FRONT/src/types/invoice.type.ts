
export type InvoiceStatus = "to_be_payed" | "payed" | "pending" | "cancelled"

export type Invoice = {
  id: number
  title: string
  payment_type: string
  status: InvoiceStatus
  estimate_id: number
  created_at: string
  updated_at: string
}