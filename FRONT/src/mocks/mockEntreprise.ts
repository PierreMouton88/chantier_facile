const mockEnterprises = [
  {
    id: 101,
    email: "contact@bati-expert.fr",
    role: "entreprise",
    is_validated: true,
    profile: {
      company_name: "BatiExpert SAS",
      first_name: "Jean",
      name: "Dupont",
      phone_number: "06 01 02 03 04",
      siret: "12345678900012"
    },
    professions: [
      { profession: { profession_name: "Plomberie" } },
      { profession: { profession_name: "Chauffage" } }
    ],
    addresses: [
      {
        address: {
          city: "Paris",
          zip_code: "75010",
          address_line_1: "15 Rue de la Grange aux Belles"
        }
      }
    ]
  },
  {
    id: 102,
    email: "renov@total.fr",
    role: "entreprise",
    is_validated: false, // En attente de validation admin
    profile: {
      company_name: "Rénov'Total",
      first_name: "Marc",
      name: "Leroy",
      phone_number: "07 88 99 00 11",
      siret: "98765432100055"
    },
    professions: [
      { profession: { profession_name: "Peinture" } },
      { profession: { profession_name: "Revêtement de sol" } }
    ]
  }
];
export default mockEnterprises;