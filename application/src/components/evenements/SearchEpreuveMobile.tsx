import React, {useState, useEffect, useRef, useCallback} from "react";
import Image from "next/image";
import { EpreuveFilters, Epreuve } from "@/type/evenement/epreuve";
import { Discipline } from "@/type/evenement/discipline";
import { useDisciplines } from "@/hook/useDisciplines";

interface SearchEpreuveMobileProps {
  onFiltersChange: (filters: EpreuveFilters) => void;
  filters: EpreuveFilters;
  epreuves: Epreuve[]; // ← Nouvelles props
}

export default function SearchEpreuveMobile({ onFiltersChange, filters, epreuves }: SearchEpreuveMobileProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<EpreuveFilters>(filters);

  // États pour la discipline
  const [disciplineSearch, setDisciplineSearch] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const { disciplines, loading, error } = useDisciplines();
  const [filteredDisciplines, setFilteredDisciplines] = useState<Discipline[]>([]);
  const [showDisciplineList, setShowDisciplineList] = useState(false);

  // États pour l'épreuve
  const [epreuveSearch, setEpreuveSearch] = useState("");
  const [showEpreuveList, setShowEpreuveList] = useState(false);
  const [filteredEpreuves, setFilteredEpreuves] = useState<Epreuve[]>([]);

  // Références pour détecter les clics à l'extérieur
  const disciplineRef = useRef<HTMLDivElement>(null);
  const epreuveRef = useRef<HTMLDivElement>(null);

  // Gestionnaire pour fermer les listes au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Vérifier si le clic est en dehors de la zone discipline
      if (disciplineRef.current && !disciplineRef.current.contains(target) && showDisciplineList) {
        setShowDisciplineList(false);
      }

      // Vérifier si le clic est en dehors de la zone épreuve
      if (epreuveRef.current && !epreuveRef.current.contains(target) && showEpreuveList) {
        setShowEpreuveList(false);
      }
    };

    // Utiliser setTimeout pour s'assurer que les autres événements sont traités en premier
    const handleClickOutsideDelayed = (event: MouseEvent) => {
      setTimeout(() => handleClickOutside(event), 0);
    };

    document.addEventListener('mousedown', handleClickOutsideDelayed);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDelayed);
    };
  }, [showDisciplineList, showEpreuveList]);

  // Filtrer les disciplines en fonction de la recherche - optimisé avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredDisciplines(
        disciplines.filter(d => d.nom.toLowerCase().includes(disciplineSearch.toLowerCase()))
      );
    }, 150); // Debounce de 150ms

    return () => clearTimeout(timer);
  }, [disciplineSearch, disciplines]);

  // Filtrer les épreuves en fonction de la discipline sélectionnée et de la recherche - optimisé
  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = epreuves;

      // Si une discipline est sélectionnée, filtrer par discipline
      if (selectedDiscipline) {
        filtered = epreuves.filter(epreuve =>
          epreuve.discipline.id === selectedDiscipline.id
        );
      }

      // Filtrer par le libellé de l'épreuve
      if (epreuveSearch) {
        filtered = filtered.filter(epreuve =>
          epreuve.libelle.toLowerCase().includes(epreuveSearch.toLowerCase())
        );
      }

      setFilteredEpreuves(filtered);
    }, 150); // Debounce de 150ms

    return () => clearTimeout(timer);
  }, [epreuves, selectedDiscipline, epreuveSearch]);

  // Gestionnaires optimisés avec useCallback
  const handleDisciplineSelect = useCallback((discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setDisciplineSearch(discipline.nom);
    setShowDisciplineList(false);
    // Mettre à jour les filtres avec l'ID de la discipline
    const newFilters = {
      ...localFilters,
      disciplineId: discipline.id
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  const handleEpreuveSelect = useCallback((epreuve: Epreuve) => {
    setEpreuveSearch(epreuve.libelle);
    setShowEpreuveList(false);
    // Mettre à jour les filtres avec le libellé de l'épreuve
    const newFilters = {
      ...localFilters,
      libelle: epreuve.libelle
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  const handleDisciplineInputChange = useCallback((value: string) => {
    setDisciplineSearch(value);
    setShowDisciplineList(true);
    // Réinitialiser la discipline sélectionnée si on modifie la recherche
    if (selectedDiscipline && value !== selectedDiscipline.nom) {
      setSelectedDiscipline(null);
      const newFilters = { ...localFilters };
      delete newFilters.disciplineId;
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    }
  }, [selectedDiscipline, localFilters, onFiltersChange]);

  const handleEpreuveInputChange = useCallback((value: string) => {
    setEpreuveSearch(value);
    setShowEpreuveList(true);
  }, []);

  const handleDateChange = useCallback((value: string) => {
    const newFilters = {
      ...localFilters,
      date: value || undefined
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    const emptyFilters: EpreuveFilters = {};
    setLocalFilters(emptyFilters);
    setSelectedDiscipline(null);
    setDisciplineSearch("");
    setEpreuveSearch("");
    onFiltersChange(emptyFilters);
  }, [onFiltersChange]);

  return (
    <div className="text-black w-full bg-base-100 rounded-[20px] shadow-[4px_4px_10px_rgba(0,0,0,0.5)]">
      {/* Header cliquable */}
      <div
        className="flex items-center justify-center p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-sm font-bold">Filtrer</h2>
        <div className="px-2">
          <Image
            src="/images/filter.png"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      {/* Contenu expansible */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-4">
            {/* Sélection de discipline*/}
            <div className="relative" ref={disciplineRef}>
              <label htmlFor="mobile-discipline" className="block text-sm font-medium mb-1">Discipline</label>
              <input
                id="mobile-discipline"
                name="discipline"
                type="text"
                placeholder="Rechercher une discipline..."
                value={disciplineSearch}
                onChange={(e) => handleDisciplineInputChange(e.target.value)}
                onFocus={() => setShowDisciplineList(true)}
                onBlur={() => {
                  // Délai pour permettre le clic sur les éléments de la liste
                  setTimeout(() => {
                    if (!disciplineRef.current?.contains(document.activeElement)) {
                      setShowDisciplineList(false);
                    }
                  }, 150);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showDisciplineList && filteredDisciplines.length > 0 && (
                <div
                  className="absolute z-[9999] w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg"
                  onMouseDown={(e) => e.preventDefault()} // Empêche le blur de l'input
                  style={{ top: '100%', left: 0 }} // Position explicite
                >
                  {filteredDisciplines.map((discipline) => (
                    <div
                      key={discipline.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleDisciplineSelect(discipline)}
                    >
                      {discipline.nom}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sélection d'épreuve */}
            <div className="relative" ref={epreuveRef}>
              <label htmlFor="mobile-epreuve" className="block text-sm font-medium mb-1">
                Épreuve {selectedDiscipline && `(${selectedDiscipline.nom})`}
              </label>
              <input
                id="mobile-epreuve"
                name="epreuve"
                type="text"
                placeholder={selectedDiscipline ?
                  `Rechercher une épreuve de ${selectedDiscipline.nom}...` :
                  "Rechercher une épreuve..."
                }
                value={epreuveSearch}
                onChange={(e) => handleEpreuveInputChange(e.target.value)}
                onFocus={() => setShowEpreuveList(true)}
                onBlur={() => {
                  // Délai pour permettre le clic sur les éléments de la liste
                  setTimeout(() => {
                    if (!epreuveRef.current?.contains(document.activeElement)) {
                      setShowEpreuveList(false);
                    }
                  }, 150);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showEpreuveList && filteredEpreuves.length > 0 && (
                <div
                  className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto"
                  onMouseDown={(e) => e.preventDefault()} // Empêche le blur de l'input
                >
                  {filteredEpreuves.map((epreuve) => (
                    <div
                      key={epreuve.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEpreuveSelect(epreuve)}
                    >
                      <div className="font-medium">{epreuve.libelle}</div>
                      <div className="text-sm text-gray-500">{epreuve.discipline.nom}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filtre par date minimum*/}
            <div>
              <label htmlFor="mobile-date" className="block text-sm font-medium mb-1">Date minimum</label>
              <input
                id="mobile-date"
                name="date"
                type="date"
                value={localFilters.date || ""}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bouton pour vider les filtres */}
            <div className="pt-2">
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}