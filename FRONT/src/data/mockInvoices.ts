import type { Invoice } from "../types/invoice.type"

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 1,
    object: "Facture - Rénovation cuisine complète",
    payment_type: "cash",
    status: "payed",
    estimate_id: 1,
    updated_at: "2025-11-16",
    created_at: "2025-11-16",
  },
  {
    id: 2,
    object: "Facture - Isolation combles",
    payment_type: "credit_card",
    status: "payed",
    estimate_id: 2,
    updated_at: "2025-11-12",
    created_at: "2025-11-12",
  },
  {
    id: 3,
    object: "Facture partielle - Salle de bain",
    payment_type: "transfer",
    status: "pending", 
    estimate_id: 3,
    updated_at: "2025-11-17",
    created_at: "2025-11-17",
  },
  {
    id: 4,
    object: "Facture - Travaux électriques",
    payment_type: "credit_card",
    status: "to_be_payed", 
    estimate_id: 1,
    updated_at: "2025-10-15",
    created_at: "2025-10-10",
  },
]
