import { useEffect, useState } from "react"
import { MOCK_ESTIMATES } from "../data/mockEstimates"
import type { Invoice } from "../types/invoice.type"
import { MOCK_INVOICES } from "../data/mockInvoices"
import { formatDate, getPaymentTypeLabel, calculateTotal, getInvoiceStatusBadge } from "../utils/helpers"
import StatusBadge from "../components/StatusBadge"

export default function Factures() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    setInvoices(MOCK_INVOICES)
  }, [])
  // Fonction pour récupérer le montant total d'une facture à partir du devis lié
  const getInvoiceTotal = (estimateId: number) => {
    const estimate = MOCK_ESTIMATES.find((est) => est.id === estimateId)
    if (!estimate) return 0
    return calculateTotal(estimate.lines)
  }
  return (
    <div>
      {invoices.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune facture à afficher.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Facture n°{invoice.id}
                  </h3>
                  <p className="text-sm text-gray-600">{invoice.object}</p>
                </div>
                <StatusBadge {...getInvoiceStatusBadge(invoice.status)} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Date de création :</span>
                  <span className="ml-2 text-gray-800">
                    {formatDate(invoice.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Paiement :</span>
                  <span className="ml-2 text-gray-800">
                    {getPaymentTypeLabel(invoice.payment_type)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Devis lié :</span>
                  <span className="ml-2 text-gray-800">
                    n°{invoice.estimate_id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Dernière MAJ :</span>
                  <span className="ml-2 text-gray-800">
                    {formatDate(invoice.updated_at)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    Montant :
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {getInvoiceTotal(invoice.estimate_id).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
