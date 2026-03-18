import { formatDate, getPaymentTypeLabel, calculateTotal, getEstimateStatusBadge } from "../../utils/helpers"
import StatusBadge from "../StatusBadge"
import { estimateService } from "../../services/estimate.service"
import { useAuthCtx } from "../../authContext/AuthContext"
import Button from "../Buttons"
import type { Estimate } from "../../types/estimate.type"

type Props = {
  projectId?: number
  hideValidateButton?: boolean
  onValidate?: (id: number) => void
}

export default function EstimateList({ projectId, hideValidateButton, onValidate }: Props) {
  const { data: estimates, isLoading, isError, error } = estimateService.getAll()
  const { user } = useAuthCtx()
  const { mutate: updateEstimate } = estimateService.update()

  const handleValidate = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir valider ce devis ?")) {
      if (onValidate) {
        onValidate(id)
      } else {
        updateEstimate({ id, data: { is_validated_by_customer: true } })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-red-600 text-sm">Erreur lors du chargement des devis: {String(error?.message ?? error)}</p>
      </div>
    )
  }

  const list: Estimate[] = estimates ?? []
  const filtered: Estimate[] = projectId ? list.filter((e) => e.project_id === projectId) : list

  return (
    <div>
      {(filtered.length ?? 0) === 0 ? (
        <p className="text-gray-500 text-sm">Aucun devis à afficher.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((estimate) => (
            <div
              key={estimate.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Devis n°{estimate.estimate_number}
                  </h3>
                  <p className="text-sm text-gray-600">{estimate.title}</p>
                </div>
                <StatusBadge
                  {...getEstimateStatusBadge(estimate.is_validated_by_customer)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Date limite :</span>
                  <span className="ml-2 text-gray-800">
                    {formatDate(String(estimate.limit_date))}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Paiement :</span>
                  <span className="ml-2 text-gray-800">
                    {getPaymentTypeLabel(estimate.payment_type)}
                  </span>
                </div>
              </div>
              {Array.isArray(estimate.lines) && estimate.lines.length > 0 ? (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="space-y-2 mb-3">
                    {estimate.lines.map((line: Estimate["lines"][number]) => (
                      <div
                        key={line.id}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>
                          {line.quantity} x {line.description}
                        </span>
                        <span className="font-medium">
                          {(line.quantity * line.price_per_qty).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">Total :</span>
                    <span className="text-xl font-bold text-blue-600">
                      {calculateTotal(estimate.lines).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ) : null}

              {user?.role === 'customer' && !estimate.is_validated_by_customer && !hideValidateButton && (
                <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                  <Button onClick={() => handleValidate(estimate.id)}>
                    Valider le devis
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
