import { Search } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  suggestions?: string[]
  onReset?: () => void
}

export const EmptyState = ({
  title = "Aucun résultat",
  description = "Aucun élément ne correspond à vos critères de recherche.",
  suggestions = [],
  onReset
}: EmptyStateProps) => (
  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
      <Search className="text-gray-400" size={32} />
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{description}</p>

    {suggestions.length > 0 && (
      <div className="text-left max-w-md mx-auto mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Suggestions :</p>
        <ul className="text-sm text-gray-600 space-y-1">
          {suggestions.map((suggestion, idx) => (
            <li key={idx}>• {suggestion}</li>
          ))}
        </ul>
      </div>
    )}

    {onReset && (
      <button
        onClick={onReset}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Réinitialiser les filtres
      </button>
    )}
  </div>
)
