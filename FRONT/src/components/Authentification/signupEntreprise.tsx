import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { EntrepriseFormValues } from "../../types/auth.form.type";
import ProfessionPillsPicker from "../ProfessionPillsPicker";
import { PROFESSION_OPTIONS } from "../../data/mockProfessions";
import { useSignupEntreprise } from "../../hooks/useAuth";
import type { EntrepriseSignupData } from "../../types/auth.type";

export default function SignUpEntreprise() {
  const navigate = useNavigate();
  const signupMutation = useSignupEntreprise();
  const initialValues: EntrepriseFormValues = {
    firstName: "",
    lastName: "",
    companyName: "",
    siret: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    contactName: "",
    password: "",
    confirmPassword: "",
    professionNames: [],
  };

  const SignupEntrepriseSchema = Yup.object({
    companyName: Yup.string().required("Le nom de l’entreprise est requis"),
    siret: Yup.string()
      .matches(/^\d{14}$/, "Le SIRET doit contenir exactement 14 chiffres.")
      .required("Le SIRET est requis"),
    email: Yup.string()
      .email("Adresse e-mail invalide.")
      .required("L’email est requis"),
    phone: Yup.string()
      .matches(
        /^\+?[0-9]{7,15}$/,
        "Numéro de téléphone invalide (ex: +33612345678)."
      )
      .required("Le numéro de téléphone est requis"),
    address: Yup.string().required("L’adresse du siège est requise"),
    zipCode: Yup.string()
      .matches(/^\d{4,10}$/i, "Code postal invalide")
      .required("Le code postal est requis"),
    city: Yup.string().required("La ville est requise"),
    country: Yup.string().required("Le pays est requis"),
    contactName: Yup.string().required("Le nom du contact est requis"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
        "8+ caractères, majuscule, minuscule, chiffre et symbole."
      )
      .required("Le mot de passe est requis"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Les mots de passe doivent correspondre.")
      .required("La confirmation du mot de passe est requise"),
  });

  const handleSubmit = async (values: EntrepriseFormValues) => {
  const payload: EntrepriseSignupData = { 
    email: values.email,
    password: values.password,
    first_name: values.contactName,
    name: values.contactName,
    phone_number: values.phone,
    company_name: values.companyName,
    siret: values.siret,
    address_line_1: values.address,
    zip_code: values.zipCode,
    city: values.city,
    country: values.country,
    professionNames: values.professionNames,
  }
  
  try {
    await signupMutation.mutateAsync(payload)
    navigate('/login', {
      state: {
        signupSuccess: true,
        message: "Inscription entreprise réussie. Vous pouvez vous connecter.",
      },
      replace: true,
    })
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string } | undefined
    const msg = err?.response?.data?.message ?? err?.message ?? 'Erreur lors de la création du compte entreprise'
    alert(msg)
  }
}


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
      {/* Logo */}
      <div className="w-20 h-20 bg-gray-200 rounded-2xl mb-6 flex items-center justify-center shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-600"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3L11 9.999" />
          <path d="M15.973 4.027A13 13 0 0 0 5.902 2.373c-1.398.342-1.092 2.158.277 2.601a19.9 19.9 0 0 1 5.822 3.024" />
          <path d="M16.001 11.999a19.9 19.9 0 0 1 3.024 5.824c.444 1.369 2.26 1.676 2.603.278A13 13 0 0 0 20 8.069" />
          <path d="M18.352 3.352a1.205 1.205 0 0 0-1.704 0l-5.296 5.296a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l5.296-5.296a1.205 1.205 0 0 0 0-1.704z" />
        </svg>
      </div>

      <h2 className="text-center text-2xl font-semibold text-[#2E3A59] mb-6">
        Créer un compte Entreprise
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupEntrepriseSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form className="w-full max-w-sm flex flex-col gap-4 mb-4 bg-white p-6 rounded-2xl shadow-md">
            {/* Company Name */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Entreprise Name..."
                value={values.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.companyName && errors.companyName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.companyName && errors.companyName && (
                <p className="text-red-500 text-sm">{errors.companyName}</p>
              )}
            </div>

            {/* SIRET */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                id="siret"
                name="siret"
                placeholder="No SIRET ..."
                value={values.siret}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.siret && errors.siret
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.siret && errors.siret && (
                <p className="text-red-500 text-sm">{errors.siret}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email ..."
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.email && errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Contact name */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                id="contactName"
                name="contactName"
                placeholder="Personne à contacter (Nom complet)"
                value={values.contactName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.contactName && errors.contactName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.contactName && errors.contactName && (
                <p className="text-red-500 text-sm">{errors.contactName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Numéro de téléphone ..."
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.phone && errors.phone
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.phone && errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Adresse du siège social..."
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.address && errors.address
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.address && errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Code postal"
                  value={values.zipCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                    touched.zipCode && errors.zipCode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.zipCode && errors.zipCode && (
                  <p className="text-red-500 text-sm">{errors.zipCode}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Ville"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                    touched.city && errors.city
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.city && errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                id="country"
                name="country"
                placeholder="Pays"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.country && errors.country
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.country && errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mot de passe..."
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.password && errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmez votre mot de passe..."
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <ProfessionPillsPicker
              options={PROFESSION_OPTIONS}
              value={values.professionNames ?? []}
              onChange={(next) => setFieldValue("professionNames", next)}
              placeholder="Rechercher un métier…"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 font-medium rounded-lg text-white transition-all ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {isSubmitting ? "Création du compte..." : "S'inscrire"}
            </button>
          </Form>
        )}
      </Formik>

      <p className="text-center text-sm text-gray-700 mb-2">
        Vous avez déjà un compte ?
      </p>
      <div className="w-full max-w-sm mb-4">
        <button
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => navigate("/login")}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
