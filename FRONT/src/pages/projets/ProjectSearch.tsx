import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, MapPin, User, Calendar, FileText } from 'lucide-react';
import { useSearchProjects } from "../../hooks/useSearch";
import { SkeletonGrid } from "../../components/Skeleton/SkeletonCard";
import { ModernPagination } from "../../components/Pagination/ModernPagination";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import type { ProjectSearchFilters } from "../../types/search.type";
import { formatDate } from "../../utils/helpers";

const ProjectSearch: React.FC = () => {
  const navigate = useNavigate();

  const [inputFilters, setInputFilters] = useState({
    city: "",
    zip_code: "",
  });

  const [filters, setFilters] = useState<ProjectSearchFilters>({
    city: "",
    zip_code: "",
    is_finished: false,
    page: 1,
    limit: 12,
    sort: "date_desc",
  });

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        city: inputFilters.city,
        zip_code: inputFilters.zip_code,
        page: 1,
      }));
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputFilters]);

  const { data, isLoading, error, isFetching } = useSearchProjects(filters);

  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.city) active.push({ key: 'city', label: `Ville: ${filters.city}` });
    if (filters.zip_code) active.push({ key: 'zip_code', label: `CP: ${filters.zip_code}` });
    return active;
  }, [filters]);

  const handleInputChange = (key: string, value: string) => {
    setInputFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRemoveFilter = (key: string) => {
    setInputFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: value as "name_asc" | "name_desc" | "date_asc" | "date_desc",
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setInputFilters({ city: "", zip_code: "" });
    setFilters({
      city: "",
      zip_code: "",
      is_finished: false,
      page: 1,
      limit: 12,
      sort: "date_desc",
    });
  };

  const handleCreateDevis = (projectId: number) => {
    navigate(`/documents/devis/new?projectId=${projectId}`);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">
            Erreur lors du chargement: {String(error?.message ?? error)}
          </p>
        </div>
      </div>
    );
  }

  const projects = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recherche de Chantiers</h1>
          <p className="text-gray-600">Trouvez des chantiers près de chez vous et créez vos devis</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-gray-400" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Filtres de recherche</h2>
            {(isSearching || isFetching) && (
              <Loader2 className="animate-spin text-blue-500" size={16} />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={inputFilters.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Paris, Lyon..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={inputFilters.zip_code}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
                placeholder="75001, 69..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tri
              </label>
              <select
                value={filters.sort || "date_desc"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="name_asc">Nom (A-Z)</option>
                <option value="name_desc">Nom (Z-A)</option>
                <option value="date_desc">Plus récents</option>
                <option value="date_asc">Plus anciens</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Filtres actifs:</span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleRemoveFilter(filter.key)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                >
                  {filter.label}
                  <X size={14} />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              <strong className="font-semibold text-gray-900">{data?.total ?? 0}</strong> chantier(s) trouvé(s)
            </span>
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : projects.length === 0 ? (
          <EmptyState
            title="Aucun chantier trouvé"
            description={hasActiveFilters
              ? "Aucun chantier ne correspond à vos critères."
              : "Il n'y a actuellement aucun chantier disponible."}
            suggestions={hasActiveFilters ? [
              "Essayez d'élargir votre zone de recherche",
              "Modifiez le statut pour voir tous les chantiers",
              "Supprimez certains filtres pour voir plus de résultats"
            ] : []}
            onReset={hasActiveFilters ? handleReset : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-gray-900 flex-1 pr-2">
                        {project.title}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap ${
                          project.is_finished
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {project.is_finished ? "Terminé" : "En cours"}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-1">
                      {project.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm">
                        <User className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-gray-700">
                          {project.customer?.first_name} {project.customer?.name}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-gray-700">
                          {project.address?.city} ({project.address?.zip_code})
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-gray-700">
                          {formatDate(project.start_date)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCreateDevis(project.id)}
                      className="w-full py-2.5 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-auto"
                    >
                      <FileText size={18} />
                      Créer un devis
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <ModernPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectSearch;
