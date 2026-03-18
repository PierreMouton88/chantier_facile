import React, { useState } from 'react';
import { useCreateAddress, useFindAddressById } from '../../hooks/useAddress';
import { useAuthCtx } from '../../authContext/AuthContext';
import type { Address } from '../../types/user.type';
import Button from '../Buttons';

// Structure des données pour le formulaire de nouvelle adresse
interface NewAddressForm {
  address_line_1: string;
  zip_code: string;
  city: string;
  country: string;
}
// Props du composant AddressPicker
interface AddressPickerProps {
  // Fonction de callback pour notifier la sélection d'une adresse
  onAddressSelected: (addressId: number) => void;
  // ID de l'adresse actuellement sélectionnée (optionnel)
  currentAddressId?: number;
  // ID de l'adresse du projet en mode édition (pour la garder dans la liste)
  projectAddressId?: number;
}

export const AddressPicker: React.FC<AddressPickerProps> = ({ onAddressSelected, currentAddressId, projectAddressId }) => {
  // --- 1 hook & contexte
  const { user } = useAuthCtx();
  const createAddressMutation = useCreateAddress();
  const { data: projectAddress } = useFindAddressById(projectAddressId || 0);

  // etats locaux
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<NewAddressForm>({
    address_line_1: '',
    zip_code: '',
    city: '',
    country: 'France'
  });

  // --- 2  Donnée dérivée du contexte utilisateur
  const userAddresses: Address[] = (user?.role !== 'admin' ? user?.addresses : []) || [];

  // --- 3 Logique métier et gestion des évènements

  // Met à jour les champs du formulaire de création
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Bascule entre sélection et création
  const toggleMode = () => {
    setIsCreating((prev) => !prev);
  };

  // Enregistre l'adresse via la mutation create address
  const handleSaveAddress = () => {
    createAddressMutation.mutate(formData, {
      onSuccess: (newAddress) => {
        onAddressSelected(newAddress.id);
        setIsCreating(false);
        setFormData({ address_line_1: '', zip_code: '', city: '', country: 'France' });
      }
    });
  };

  return (
    <div className="border rounded-xl p-4 bg-gray-50 space-y-4">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          📍 Adresse du chantier
        </h3>
        <Button
          type="button"
          variant="secondary"
          onClick={toggleMode}
          className="text-xs"
        >
          {isCreating ? "Choisir une adresse existante" : "Créer une nouvelle adresse"}
        </Button>
      </div>

      {/* MODE D'AFFICHAGE *isCreatingé*/}
      {!isCreating ? (
        /* Sélection entre adresses existantes */
        <div className="space-y-2">
          <select
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={currentAddressId || ""}
            onChange={(e) => onAddressSelected(Number(e.target.value))}
          >
            <option value="">-- Sélectionner une adresse --</option>
            {/* 1. Les adresses de l'utilisateur */}
            {userAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                🏠 {addr.address_line_1}, {addr.city} (Profil)
              </option>
            ))}

            {/* 2. L'adresse du chantier (si elle n'est pas dans les adresses user) */}
            {projectAddress && !userAddresses.some((a) => a.id === projectAddress.id) && (
              <option value={projectAddress.id}>
                📍 {projectAddress.address_line_1}, {projectAddress.city} (Chantier)
              </option>
            )}

            {userAddresses.length === 0 && !projectAddress && (
              <option disabled>Aucune adresse enregistrée</option>
            )}
          </select>
          <p className="text-xs text-gray-400 italic">
            Astuce : Si l'adresse n'est pas dans la liste, cliquez sur "Créer une nouvelle adresse".
          </p>
        </div>
      ) : (
        /* Création d'une nouvelle adresse */
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <input
            type="text"
            name="address_line_1"
            placeholder="Adresse (N°, rue...)"
            value={formData.address_line_1}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />


          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="number"
              name="zip_code"
              placeholder="Code Postal"
              value={formData.zip_code}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              name="city"
              placeholder="Ville"
              value={formData.city}
              onChange={handleInputChange}

              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"

            />
            <input
              type="text"
              name="country"
              placeholder="Pays"
              value={formData.country}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* validation */}
          <Button
            type="button"
            className="w-full mt-2"
            loading={createAddressMutation.isPending}
            onClick={handleSaveAddress}
            //check que les champs obligatoires sont remplis
            disabled={!formData.address_line_1 || !formData.city || formData.zip_code.length < 5}
            variant="primary"
          >
            Valider cette nouvelle adresse
          </Button>

          {createAddressMutation.isError && (
            <p className="text-xs text-red-500 text-center italic">
              Erreur lors de la création de l'adresse.
            </p>
          )}
        </div>
      )}
    </div>
  );
};