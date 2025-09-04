import {useCallback, useEffect, useRef, useState} from "react";
import {Epreuve, EpreuveFilters} from "@/type/evenement/epreuve";
import {Discipline} from "@/type/evenement/discipline";
import {useDisciplines} from "@/hook/useDisciplines";

interface Props {
  onFiltersChange: (filters: EpreuveFilters) => void;
  filters: EpreuveFilters;
  epreuves: Epreuve[];
}

export default function SearchEpreuveDesktop({
                                               onFiltersChange,
                                               filters,
                                               epreuves,
                                             }: Props) {

  const [localFilters, setLocalFilters] = useState<EpreuveFilters>(filters);

  // États pour la discipline
  const [disciplineSearch, setDisciplineSearch] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const {disciplines} = useDisciplines();
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

      if (disciplineRef.current && !disciplineRef.current.contains(target) && showDisciplineList) {
        setShowDisciplineList(false);
      }
      if (epreuveRef.current && !epreuveRef.current.contains(target) && showEpreuveList) {
        setShowEpreuveList(false);
      }
    };

    const handleClickOutsideDelayed = (event: MouseEvent) => {
      setTimeout(() => handleClickOutside(event), 0);
    };

    document.addEventListener('mousedown', handleClickOutsideDelayed);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDelayed);
    };
  }, [showDisciplineList, showEpreuveList]);

  // Filtrer les disciplines avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredDisciplines(
        disciplines.filter(d => d.nom.toLowerCase().includes(disciplineSearch.toLowerCase()))
      );
    }, 150);

    return () => clearTimeout(timer);
  }, [disciplineSearch, disciplines]);

  // Filtrer les épreuves avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = epreuves;

      if (selectedDiscipline) {
        filtered = epreuves.filter(epreuve =>
          epreuve.discipline.id === selectedDiscipline.id
        );
      }

      if (epreuveSearch) {
        filtered = filtered.filter(epreuve =>
          epreuve.libelle.toLowerCase().includes(epreuveSearch.toLowerCase())
        );
      }

      setFilteredEpreuves(filtered);
    }, 150);

    return () => clearTimeout(timer);
  }, [epreuves, selectedDiscipline, epreuveSearch]);

  // Gestionnaires optimisés avec useCallback
  const handleDisciplineSelect = useCallback((discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setDisciplineSearch(discipline.nom);
    setShowDisciplineList(false);
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
    if (selectedDiscipline && value !== selectedDiscipline.nom) {
      setSelectedDiscipline(null);
      const newFilters = {...localFilters};
      delete newFilters.disciplineId;
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    }
  }, [selectedDiscipline, localFilters, onFiltersChange]);

  const handleEpreuveInputChange = useCallback((value: string) => {
    setEpreuveSearch(value);
    setShowEpreuveList(true);
  }, []);

  const handleInputChange = (field: keyof EpreuveFilters, value: string) => {
    const newFilters = {
      ...localFilters,
      [field]: value || undefined,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = useCallback(() => {
    const emptyFilters: EpreuveFilters = {};
    setLocalFilters(emptyFilters);
    setSelectedDiscipline(null);
    setDisciplineSearch("");
    setEpreuveSearch("");
    onFiltersChange(emptyFilters);
  }, [onFiltersChange]);

  return (
    <>
      <div className="flex justify-center w-full">
        <div
          className="bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 p-2">
          <div className="flex items-center divide-x divide-gray-300">

            {/* Discipline */}
            <div className="relative px-6 py-3" ref={disciplineRef}>
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Discipline
                </label>
                <input
                  id="desktop-discipline"
                  name="discipline"
                  type="text"
                  placeholder="Toutes disciplines"
                  value={disciplineSearch}
                  onChange={(e) => handleDisciplineInputChange(e.target.value)}
                  onFocus={() => setShowDisciplineList(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!disciplineRef.current?.contains(document.activeElement)) {
                        setShowDisciplineList(false);
                      }
                    }, 150);
                  }}
                  className="text-sm text-gray-600 placeholder-gray-400 border-0 focus:outline-none bg-transparent w-full min-w-[120px]"
                />
              </div>
              {showDisciplineList && filteredDisciplines.length > 0 && (
                <div
                  className="absolute top-full left-0 z-20 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl min-w-[200px] max-h-60 overflow-y-auto"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {filteredDisciplines.map((discipline) => (
                    <div
                      key={discipline.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => handleDisciplineSelect(discipline)}
                    >
                      <div className="text-sm font-medium text-gray-800">{discipline.nom}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Épreuve */}
            <div className="relative px-6 py-3" ref={epreuveRef}>
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Épreuve
                </label>
                <input
                  id="desktop-epreuve"
                  name="epreuve"
                  type="text"
                  placeholder={selectedDiscipline ?
                    `Épreuves ${selectedDiscipline.nom}` :
                    "Toutes épreuves"
                  }
                  value={epreuveSearch}
                  onChange={(e) => handleEpreuveInputChange(e.target.value)}
                  onFocus={() => setShowEpreuveList(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!epreuveRef.current?.contains(document.activeElement)) {
                        setShowEpreuveList(false);
                      }
                    }, 150);
                  }}
                  className="text-sm text-gray-600 placeholder-gray-400 border-0 focus:outline-none bg-transparent w-full min-w-[120px]"
                />
              </div>
              {showEpreuveList && filteredEpreuves.length > 0 && (
                <div
                  className="absolute top-full left-0 z-20 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl min-w-[250px] max-h-60 overflow-y-auto"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {filteredEpreuves.map((epreuve) => (
                    <div
                      key={epreuve.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => handleEpreuveSelect(epreuve)}
                    >
                      <div className="text-sm font-medium text-gray-800">{epreuve.libelle}</div>
                      <div className="text-xs text-gray-500">{epreuve.discipline.nom}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date  */}
            <div className="px-6 py-3">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  À partir du
                </label>
                <input
                  id="desktop-date"
                  name="date"
                  type="date"
                  value={localFilters.date || ""}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="text-sm text-gray-600 border-0 focus:outline-none bg-transparent w-full min-w-[120px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles secondaires */}
      <div className="flex justify-center items-center mt-4">
        {/* Bouton effacer */}
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-600 hover:text-black underline transition-colors duration-200"
        >
          Effacer les filtres
        </button>
      </div>
    </>
  );
}