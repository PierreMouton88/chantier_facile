import type { Estimate } from "../types/estimate.type"

export const MOCK_ESTIMATES: Estimate[] = [
  {
    id: 1,
    object: "Rénovation cuisine complète",
    estimate_number: 2025001,
    payment_type: "cash",
    is_validated_by_customer: true,
    limit_date: "2025-12-31",
    // project_id, user_id, updated_at, created_at pas pertinents pour le mock, mais attention à les gérer quand on mettra le back
   
    lines: [
      {
        id: 1,
        quantity: 1,
        description: "Démolition ancienne cuisine",
        price_per_qty: 800.00,
        subtotal: 800.00,
      },
      {
        id: 2,
        quantity: 1,
        description: "Pose nouveaux meubles",
        price_per_qty: 2500.00,
        subtotal: 2500.00,
      },
      {
        id: 3,
        quantity: 8,
        description: "Prises électriques",
        price_per_qty: 45.00,
        subtotal: 360.00,
      },
    ],
  },
  {
    id: 2,
    object: "Isolation combles",
    estimate_number: 2025002,
    payment_type: "credit_card",
    is_validated_by_customer: true,
    limit_date: "2025-11-30",
    lines: [
      {
        id: 4,
        quantity: 50,
        description: "Laine de verre (m²)",
        price_per_qty: 25.00,
        subtotal: 1250.00,
      },
      {
        id: 5,
        quantity: 1,
        description: "Pose et finitions",
        price_per_qty: 1500.00,
        subtotal: 1500.00,
      },
    ],
  },
  {
    id: 3,
    object: "Salle de bain - Carrelage et plomberie",
    estimate_number: 2025003,
    payment_type: "transfer",
    is_validated_by_customer: false,
    limit_date: "2025-12-15",
    lines: [
      {
        id: 6,
        quantity: 20,
        description: "Carrelage mural (m²)",
        price_per_qty: 35.00,
        subtotal: 700.00,
      },
      {
        id: 7,
        quantity: 10,
        description: "Carrelage sol (m²)",
        price_per_qty: 45.00,
        subtotal: 450.00,
      },
      {
        id: 8,
        quantity: 1,
        description: "Installation plomberie",
        price_per_qty: 1800.00,
        subtotal: 1800.00,
      },
    ],
  },
]
