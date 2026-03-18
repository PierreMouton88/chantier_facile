import { useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import type { SignupFormValues } from '../../types/auth.form.type'
import { useSignupCustomer } from '../../hooks/useAuth'

export default function SignUpUser() {
  const navigate = useNavigate()
  const signupMutation = useSignupCustomer()
  const initialValues: SignupFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
  }

  const SignupSchema = Yup.object({
    firstName: Yup.string().required('Le prénom est requis'),
    lastName: Yup.string().required('Le nom est requis'),
    email: Yup.string().email('Addresse email invalide').required("L'email est requis"),
    telephone: Yup.string()
      .matches(/^(\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/,
        'Numéro français invalide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78).')
      .required('Le numéro de téléphone est requis'),
    address: Yup.string().required("L'addresse (numéro et rue) est requise"),
    zipCode: Yup.string()
      .matches(/^\d{4,10}$/i, 'Code postal invalide')
      .required('Le code postal est requis'),
    city: Yup.string().required('La ville est requise'),
    country: Yup.string().required('Le pays est requis'),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
        '8+ caractères, majuscule, minuscule, chiffre et symbole.'
      )
      .required('Le mot de passe est requis'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre')
      .required('La confirmation du mot de passe est requise'),
  })

  const handleSubmit = async (values: SignupFormValues) => {
    const payload = {
      name: `${values.firstName} ${values.lastName}`.trim(),
      first_name: values.firstName,
      phone_number: values.telephone,
      email: values.email,
      password: values.password,
      address_line_1: values.address,
      zip_code: values.zipCode,
      city: values.city,
      country: values.country,
    }
    try {
      await signupMutation.mutateAsync(payload)
      navigate('/login', {
        state: {
          signupSuccess: true,
          message: 'Inscription réussie. Vous pouvez vous connecter.'
        },
        replace: true,
      })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string } | undefined
      const message = err?.response?.data?.message ?? err?.message ?? 'Erreur lors de la création du compte'
      alert(message)
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
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-center text-2xl font-semibold text-[#2E3A59] mb-6">
        Créer un compte
      </h2>

      {/* Form (classes inchangées) */}
      <Formik initialValues={initialValues} validationSchema={SignupSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form className="w-full max-w-sm flex flex-col gap-4 mb-4 bg-white p-6 rounded-2xl shadow-md">
            {/* First Name */}
            <div className="flex flex-col gap-1">
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Prénom"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.firstName && errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1">
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Nom"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.lastName && errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="flex flex-col gap-1">
              <input
                id="telephone"
                name="telephone"
                type="tel"
                placeholder="Numéro de téléphone"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.telephone}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.telephone && errors.telephone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.telephone && errors.telephone && (
                <p className="text-red-500 text-sm">{errors.telephone}</p>
              )}
            </div>

            {/* Addresse */}
            <div className="flex flex-col gap-1">
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Numéro et nom de rue"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.address && errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.address && errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            {/* Code postal */}
            <div className="flex flex-col gap-1">
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                placeholder="Code postal"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.zipCode}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.zipCode && errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.zipCode && errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode}</p>
              )}
            </div>

            {/* Ville */}
            <div className="flex flex-col gap-1">
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Ville"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.city}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.city && errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.city && errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>

            {/* Pays */}
            <div className="flex flex-col gap-1">
              <input
                id="country"
                name="country"
                type="text"
                placeholder="Pays"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.country}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.country && errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.country && errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmer le mot de passe"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 font-medium rounded-lg text-white transition-all ${
                isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? 'Inscription...' : "S'inscrire"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Info + CTA identiques */}
      <p className="text-center text-sm text-gray-700 mb-2">Vous avez déjà un compte ?</p>
      <div className="w-full max-w-sm mb-4">
        <button
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => navigate('/login')}
        >
          Se connecter
        </button>
      </div>
    </div>
  )
}
