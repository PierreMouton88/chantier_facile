import { useState, useEffect, useMemo } from "react";
import { Search, X, Loader2 } from 'lucide-react';
import EntrepriseCard from "../../components/Directory/EntrepriseCardProps";
import { useSearchCompanies } from "../../hooks/useSearch";
import { SkeletonGrid } from "../../components/Skeleton/SkeletonCard";
import { ModernPagination } from "../../components/Pagination/ModernPagination";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import type { EntrepriseProfile } from "../../types/user.type";
import type { CompanySearchFilters } from "../../types/search.type";

const DirectoryPage: React.FC = () => {
  const [inputFilters, setInputFilters] = useState({
    city: "",
    zip_code: "",
    profession: "",
  });

  const [filters, setFilters] = useState<CompanySearchFilters>({
    city: "",
    zip_code: "",
    profession: "",
    page: 1,
    limit: 12,
    sort: "name_asc",
  });

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        city: inputFilters.city,
        zip_code: inputFilters.zip_code,
        profession: inputFilters.profession,
        page: 1,
      }));
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputFilters]);

  const { data, isLoading, error, isFetching } = useSearchCompanies(filters);

  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.city) active.push({ key: 'city', label: `Ville: ${filters.city}` });
    if (filters.zip_code) active.push({ key: 'zip_code', label: `CP: ${filters.zip_code}` });
    if (filters.profession) active.push({ key: 'profession', label: `Métier: ${filters.profession}` });
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
      sort: value as "name_asc" | "name_desc",
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setInputFilters({ city: "", zip_code: "", profession: "" });
    setFilters({
      city: "",
      zip_code: "",
      profession: "",
      page: 1,
      limit: 12,
      sort: "name_asc",
    });
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

  const companies = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Annuaire des entreprises</h1>
          <p className="text-gray-600">Trouvez les professionnels près de chez vous</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profession
              </label>
              <input
                type="text"
                value={inputFilters.profession}
                onChange={(e) => handleInputChange("profession", e.target.value)}
                placeholder="Plomberie, Électricité..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tri
              </label>
              <select
                value={filters.sort || "name_asc"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="name_asc">Nom (A-Z)</option>
                <option value="name_desc">Nom (Z-A)</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Filtres actifs:</span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleRemoveFilter(filter.key)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                >
                  {filter.label}
                  <X size={14} />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              <strong className="font-semibold text-gray-900">{data?.total ?? 0}</strong> entreprise(s) trouvée(s)
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-800 font-medium transition"
              >
                Réinitialiser tout
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : companies.length === 0 ? (
          <EmptyState
            title="Aucune entreprise trouvée"
            description={hasActiveFilters
              ? "Aucune entreprise ne correspond à vos critères."
              : "Il n'y a actuellement aucune entreprise dans l'annuaire."}
            suggestions={hasActiveFilters ? [
              "Essayez d'élargir votre zone de recherche",
              "Vérifiez l'orthographe des filtres",
              "Supprimez certains filtres pour voir plus de résultats"
            ] : []}
            onReset={hasActiveFilters ? handleReset : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {companies.map((company) => (
                <EntrepriseCard
                  key={company.id}
                  profile={company.profile as EntrepriseProfile}
                  email={company.email}
                  addresses={company.addresses}
                  professions={company.professions}
                />
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

export default DirectoryPage;
