import { useNavigate, useLocation } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import type { SigninFormValues } from '../../types/auth.form.type'
import { useSignIn } from '../../hooks/useAuth'
import { useAuthCtx } from '../../authContext/AuthContext'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { signupSuccess?: boolean; message?: string } }
  const signinMutation = useSignIn()
  const { loginCtx } = useAuthCtx()

  const initialValues: SigninFormValues = {
    email: '',
    password: '',
  }

  const SigninSchema = Yup.object({
    email: Yup.string()
      .email('Adresse email invalide')
      .required("L'email est requis"),
    password: Yup.string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .required('Le mot de passe est requis'),
  })

  const handleSubmit = async (values: SigninFormValues) => {
    try {
      const res = await signinMutation.mutateAsync(values)
      loginCtx(res) // persiste access+refresh+user et met à jour le contexte
      const role = res.user?.role
      navigate(role === 'admin' ? '/admin' : '/dashboard')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string } | undefined
      const message = err?.response?.data?.message ?? err?.message ?? 'Erreur lors de la connexion'
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
          <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
          <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-center text-2xl font-semibold text-[#2E3A59] mb-6">
        Login Individual <br /> or Entreprise
      </h2>

      {/* Form (classes conservées) */}
      <Formik initialValues={initialValues} validationSchema={SigninSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form className="w-full max-w-sm flex flex-col gap-4 mb-4 bg-white p-6 rounded-2xl shadow-md">
            {location.state?.signupSuccess && (
              <div className="w-full px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm">
                {location.state?.message || 'Inscription réussie.'}
              </div>
            )}
            {/* Email */}
            <div className="flex flex-col gap-1">
              <input
                type="email"
                name="email"
                placeholder="Email ..."
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <input
                type="password"
                name="password"
                placeholder="Password ..."
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black transition-all ${
                  touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 font-medium rounded-lg text-white transition-all ${
                isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </Form>
        )}
      </Formik>

      {/* Info text + CTAs conservés */}
      <p className="text-center text-sm text-gray-700 mb-2">No account?</p>

      {/* Signup buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <div className="text-center text-sm text-gray-700 mb-1">Individual:</div>
        <button
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => navigate('/signupUser')}
        >
          Sign up
        </button>

        <div className="text-center text-sm text-gray-700 mt-3 mb-1">Entreprise:</div>
        <button
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => navigate('/signupEntreprise')}
        >
          Sign up as Entreprise
        </button>
      </div>
    </div>
  )
}
