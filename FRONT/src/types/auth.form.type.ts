// Types des formulaires d'authentification (frontend)

export type SigninFormValues = {
  email: string;
  password: string;
};

export type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
};

export type EntrepriseFormValues = {
  firstName: string;
  lastName: string;
  companyName: string;
  siret: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  contactName: string;
  password: string;
  confirmPassword: string;
  professionNames: string[];
};
