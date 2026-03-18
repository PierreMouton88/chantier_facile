import React from 'react';
import { Building2, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import type { EntrepriseProfile, Address } from '../../types/user.type';

interface EntrepriseCardProps {
  profile: EntrepriseProfile;
  email?: string;
  addresses?: Address[];
  professions?: string[];
}

const EntrepriseCard: React.FC<EntrepriseCardProps> = ({
  profile,
  email,
  addresses = [],
  professions = []
}) => {
  const {
    company_name,
    siret,
    first_name,
    name,
    phone_number
  } = profile;

  const address = addresses[0];

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <Building2 className="text-blue-600 group-hover:text-white transition-colors" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate mb-1">{company_name}</h2>
            <p className="text-xs text-gray-500">SIRET: {siret}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <User className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
            <span className="text-gray-700">{first_name} {name}</span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <Phone className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
            <a href={`tel:${phone_number}`} className="text-gray-700 hover:text-blue-600 transition-colors">
              {phone_number}
            </a>
          </div>

          {email && (
            <div className="flex items-start gap-2 text-sm">
              <Mail className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
              <a href={`mailto:${email}`} className="text-gray-700 hover:text-blue-600 transition-colors truncate">
                {email}
              </a>
            </div>
          )}

          {address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
              <div className="text-gray-700">
                <div>{address.address_line_1}</div>
                <div>{address.zip_code} {address.city}</div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="text-gray-400" size={16} />
            <span className="text-sm font-semibold text-gray-700">Expertises</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {professions.length > 0 ? (
              professions.map((prof: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium border border-blue-200"
                >
                  {prof}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic text-sm">Aucune expertise renseignée</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepriseCard;