import { defineConfig } from 'vite';
const mockDocuments = {
  estimates: [
    {
      id: 501,
      estimate_number: 2024001,
      title: "Rénovation Plomberie",
      is_validated_by_customer: true,
      limit_date: "2024-04-15",
      entreprise: { profile: { company_name: "BatiExpert SAS" } },
      project: { title: "Salle de Bain" },
      total_ht: 770.50,
      lines: [
        { description: "Main d'oeuvre", quantity: 1, price_per_qty: 450.00 },
        { description: "Receveur douche", quantity: 1, price_per_qty: 320.50 }
      ]
    },
    {
      id: 502,
      estimate_number: 2024008,
      title: "Peinture murs et plafonds",
      is_validated_by_customer: false,
      limit_date: "2024-05-01",
      entreprise: { profile: { company_name: "Rénov'Total" } },
      project: { title: "Peinture Salon" },
      total_ht: 1200.00,
      lines: []
    }
  ],
  invoices: [
    {
      id: 901,
      title: "Acompte 30% - Plomberie",
      status: "payed", // Enum InvoiceStatus: payed
      payment_type: "credit_card",
      created_at: "2024-03-10",
      amount: 231.15,
      estimate: { estimate_number: 2024001 }
    }
  ]
};
export default mockDocuments;