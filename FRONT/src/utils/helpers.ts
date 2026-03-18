import type { Estimate } from "../types/estimate.type"
import type { InvoiceStatus } from "../types/invoice.type"

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR")
}

export const getPaymentTypeLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
    cash: "Espèces",
    credit_card: "Carte bancaire",
    bank_transfer: "Virement",
    check: "Chèque",
  }
  return labels[type] || type
}

// Pour calculer les lignes d'un tableau de devis/facture
export const calculateTotal = (lines: Estimate["lines"]): number => {
  return lines.reduce((total, line) => total + line.quantity * line.price_per_qty, 0)
}

//obligé de reappeler type ici car TS aime pas les imports de type
type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral"
export const getInvoiceStatusBadge = (
  status: InvoiceStatus
): { label: string; variant: BadgeVariant } => {
  const statusMap: Record<
    InvoiceStatus,
    { label: string; variant: BadgeVariant }
  > = {
    to_be_payed: { label: "À payer", variant: "error" },
    payed: { label: "Payée", variant: "success" },
    pending: { label: "En attente", variant: "warning" },
    cancelled: { label: "Annulée", variant: "neutral" },
  }

  return statusMap[status]
}

export const getEstimateStatusBadge = (
  isValidated: boolean
): { label: string; variant: BadgeVariant } => {
  return isValidated
    ? { label: "Validé", variant: "success" }
    : { label: "En attente", variant: "warning" }
}
