import type { User } from "../types/user.type";

export const mockUser: User = {
  id: 1,
  role: "entreprise",
  email: "contact@batipro.fr",
  profile: {
    email: "contact@batipro.fr",
    raisonSociale: "BatiPro",
    siret: "123 456 789 00012",
    firstName: "Jean",
    name: "Dupont",
    telephone: "06 12 34 56 78",
    address: {
      address_line_1: "12 rue des Lilas",
      zip_code: "75012",
      city: "Paris",
      country: "France",
    },
    professions: ["Plomberie", "Électricité", "Maçonnerie"],
  },
};
export const mockUser2: User = {
  id: 2,
  role: "customer",
  email: "marie.dupont@example.com",
  profile: {
    email: "marie.dupont@example.com",
    firstName: "Marie",
    name: "Dupont",
    telephone: "07 56 34 12 98",
    address: {
      address_line_1: "24 avenue des Cerisiers",
      zip_code: "69007",
      city: "Lyon",
      country: "France",
    },
  },
};
