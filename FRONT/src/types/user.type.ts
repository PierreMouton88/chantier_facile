/**
 * User type definition
 */
export type Role = "customer" | "entreprise" | "admin";

/**
 * Address type definition
 */
export type Address = {
  id?: number;
  address_line_1: string;
  zip_code: string;
  city: string;
  country: string;
}

/**
 * Customer profile type definition
 */
export type CustomerProfile = {
  first_name: string
  name: string
  phone_number: string
}

/**
 * Entreprise profile type definition
 */
export type EntrepriseProfile = {
  company_name: string
  siret: string
  first_name: string
  name: string
  phone_number: string
}

/**
 * User type definition
 */
export type User =
  | { id: number; role: "customer"; email: string; profile: CustomerProfile; addresses: Address[] }
  | { id: number; role: "entreprise"; email: string; profile: EntrepriseProfile; professions: string[]; addresses: Address[] }
  | { id: number; role: "admin"; email: string }

