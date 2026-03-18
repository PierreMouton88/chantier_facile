import { useMemo, useState } from "react";

type Profession = {
  id: number;
  profession_name: string;
};

interface Props {
  options?: Profession[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export default function ProfessionPillsPicker({
  options = [],
  value,
  onChange,
  placeholder = "Rechercher un métier…",
}: Props) {
  const [query, setQuery] = useState("");

  // Extraire les noms des professions
  const professionNames = useMemo(() =>
    options.map(p => p.profession_name),
    [options]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return professionNames.filter((o) => !value.includes(o));
    return professionNames
      .filter((o) => !value.includes(o))
      .filter((o) => o.toLowerCase().includes(q));
  }, [professionNames, value, query]);

  const add = (opt: string) => {
    if (!professionNames.includes(opt)) return;
    if (value.includes(opt)) return;
    onChange([...value, opt]);
    setQuery("");
  };

  const remove = (opt: string) => {
    onChange(value.filter((v) => v !== opt));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const exact = filtered.find(
        (o) => o.toLowerCase() === query.trim().toLowerCase()
      );
      if (exact) add(exact);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.length ? (
          value.map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800"
            >
              {p}
              <button
                type="button"
                className="rounded-full bg-blue-100/60 px-1.5 text-xs text-blue-700 hover:bg-blue-200"
                onClick={() => remove(p)}
                aria-label={`Retirer ${p}`}
                title={`Retirer ${p}`}
              >
                ✕
              </button>
            </span>
          ))
        ) : (
          <span className="text-slate-500">Aucun métier sélectionné</span>
        )}
      </div>

      <div className="relative">
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {query.trim().length > 0 && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
            {filtered.length ? (
              <ul className="max-h-64 overflow-auto">
                {filtered.map((opt) => (
                  <li key={opt}>
                    <button
                      type="button"
                      onClick={() => add(opt)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-50"
                    >
                      <span className="text-slate-900">{opt}</span>
                      <span className="text-xs text-slate-500">Ajouter</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-2 text-sm text-slate-500">
                Aucun résultat
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500">
        Seuls les métiers présents dans la liste sont autorisés. Pour toute
        question voir avec un administrateur à l'addresse admin@chantier-facile.fr
      </p>
    </div>
  );
}
