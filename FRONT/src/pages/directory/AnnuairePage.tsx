import { useState } from "react";
import mockEnterprises from "../../mocks/mockEntreprise";
import { BadgeCheck, Hammer, MapPin, Phone, Search, Send } from "lucide-react";

const AnnuaireSimple = () => {
  const [search, setSearch] = useState("");

  const filtered = mockEnterprises.filter(ent => 
    ent.profile.company_name.toLowerCase().includes(search.toLowerCase()) ||
    ent.professions.some(p => p.profession.profession_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Annuaire ChantierFacile</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Trouvez et contactez les entreprises vérifiées pour vos projets de travaux.</p>
        
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un métier ou une entreprise..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-orange-500 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((ent) => (
          <div key={ent.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Hammer size={28} />
                </div>
                {ent.is_validated && (
                  <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    <BadgeCheck size={14} /> Vérifié
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">{ent.profile.company_name}</h2>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin size={16} className="mr-2 text-orange-400" />
                  {ent.addresses?.[0]?.address.city} ({ent.addresses?.[0]?.address.zip_code})
                </div>
                <div className="flex flex-wrap gap-2">
                  {ent.professions.map((p, idx) => (
                    <span key={idx} className="text-[10px] font-bold uppercase px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {p.profession.profession_name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">
                  <Send size={18} /> Projet
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-50 text-orange-600 font-semibold hover:bg-orange-100 transition-colors">
                  <Phone size={18} /> Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnuaireSimple;