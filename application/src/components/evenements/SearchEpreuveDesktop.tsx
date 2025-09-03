import Image from "next/image";
import { useState } from "react";
import { EpreuveFilters } from "@/type/evenement/epreuve";

interface SearchEpreuveDesktopProps {
  onFiltersChange: (filters: EpreuveFilters) => void;
  filters: EpreuveFilters;
}

export default function SearchEpreuveDesktop({
  onFiltersChange,
  filters,
}: SearchEpreuveDesktopProps) {
  const [localFilters, setLocalFilters] = useState<EpreuveFilters>(filters);

  const handleInputChange = (field: keyof EpreuveFilters, value: string) => {
    const newFilters = {
      ...localFilters,
      [field]: value || undefined,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: EpreuveFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <>
      <div className="text-black w-full bg-base-100 rounded-[20px] shadow-[4px_4px_10px_rgba(0,0,0,0.5)] p-4">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-lg font-bold">Rechercher des épreuves</h2>
          <div className="px-2">
            <Image
              src="/images/searchIcon(24).png"
              width={20}
              height={20}
              alt="searchIcon"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche textuelle */}
          <div className="flex flex-col">
            <label
              htmlFor="search-libelle"
              className="text-sm font-medium mb-1"
            >
              Recherche
            </label>
            <input
              id="search-libelle"
              name="libelle"
              type="text"
              placeholder="Nom de l'épreuve ou discipline..."
              value={localFilters.libelle || ""}
              onChange={(e) => handleInputChange("libelle", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtre par date */}
          <div className="flex flex-col">
            <label htmlFor="search-date" className="text-sm font-medium mb-1">
              Date
            </label>
            <input
              id="search-date"
              name="date"
              type="date"
              value={localFilters.date || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtre par tour */}
          <div className="flex flex-col">
            <label htmlFor="search-tour" className="text-sm font-medium mb-1">
              Tour
            </label>
            <select
              id="search-tour"
              name="tour"
              value={localFilters.tour || ""}
              onChange={(e) => handleInputChange("tour", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les tours</option>
              <option value="Qualifications">Qualifications</option>
              <option value="Demi-finales">Demi-finales</option>
              <option value="Finales">Finales</option>
              <option value="Éliminatoires">Éliminatoires</option>
            </select>
          </div>

          {/* Tri */}
          <div className="flex flex-col">
            <label htmlFor="search-sort" className="text-sm font-medium mb-1">
              Trier par
            </label>
            <select
              id="search-sort"
              name="sort"
              value={`${localFilters.sortBy || ""}-${localFilters.sortOrder || ""}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                const newFilters = {
                  ...localFilters,
                  sortBy: (sortBy as "date" | "libelle") || undefined,
                  sortOrder: (sortOrder as "asc" | "desc") || undefined,
                };
                setLocalFilters(newFilters);
                onFiltersChange(newFilters);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="-">Aucun tri</option>
              <option value="date-asc">Date croissante</option>
              <option value="date-desc">Date décroissante</option>
              <option value="libelle-asc">Nom A-Z</option>
              <option value="libelle-desc">Nom Z-A</option>
            </select>
          </div>
        </div>

        {/* Bouton pour vider les filtres */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Effacer les filtres
          </button>
        </div>
      </div>
    </>
  );
}