// Formulaire réutilisable de création de devis: gère état, validation, soumission et affichage
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { estimateService } from '../../services/estimate.service'
import { useGetAllProjectsByUserId, useFindProjectById, useFindProjectWithTasks } from '../../hooks/useProject'
import { useGetProjectDetails, useGetProjectTasks } from '../../hooks/useSearch'
import Button from '../Buttons'
import { useAuthCtx } from '../../authContext/AuthContext'
import { Plus, Trash2 } from 'lucide-react'
type AddressResp = { address_line_1: string; zip_code: string; city: string; country: string }

type Props = {
  projectId?: number
  onCreated?: () => void
}

export default function CreateDevisForm({ projectId, onCreated }: Props) {
  const navigate = useNavigate()
  const { user } = useAuthCtx()
  const initialProjectId = projectId ?? 0
  const [currentProjectId, setCurrentProjectId] = useState<number>(initialProjectId)

  // Valeurs initiales du formulaire (dates et champs par défaut)
  const initialValues = {
    estimate_number: '',
    limit_date: new Date().toISOString().split('T')[0],
    payment_type: 'bank_transfer',
    project_id: initialProjectId,
    lines: [
      { description: '', quantity: 1, price_per_qty: 0 },
    ],
  }

  // Schéma de validation avec contraintes métiers (numéro requis, date, paiement, projet)
  const validationSchema = Yup.object().shape({
    estimate_number: Yup.number(),
    limit_date: Yup.date().required('La date limite est requise'),
    payment_type: Yup.string()
      .oneOf(['cash', 'check', 'credit_card', 'bank_transfer'])
      .required('Le mode de paiement est requis'),
    project_id: initialProjectId
      ? Yup.number().min(1)
      : Yup.number().min(1, 'Projet requis').required('Le projet est requis'),
    lines: Yup.array().of(
      Yup.object().shape({
        description: Yup.string().required('Description requise'),
        quantity: Yup.number().min(1, 'Min 1').required('Requis'),
        price_per_qty: Yup.number().min(0, 'Min 0').required('Requis'),
      })
    ),
  })

  const { mutate: createWithLines, isPending, error } = estimateService.createWithLines()
  const { data: projects } = useGetAllProjectsByUserId(user?.id || 0)
  const { data: estimates } = estimateService.getAll()

  const selectedProject = useMemo(() => (projects ?? []).find(p => p.id === currentProjectId), [projects, currentProjectId])
  const customerId = selectedProject?.customer_id

  const isExternalProject = user?.role === 'entreprise' && !selectedProject

  const { data: projectDetailOwned } = useFindProjectById(isExternalProject ? 0 : currentProjectId)
  const { data: projectWithTasksOwned } = useFindProjectWithTasks(isExternalProject ? 0 : currentProjectId)
  const { data: projectDetailExternal } = useGetProjectDetails(isExternalProject ? currentProjectId : 0)
  const { data: projectWithTasksExternal } = useGetProjectTasks(isExternalProject ? currentProjectId : 0)

  const projectDetail = isExternalProject ? projectDetailExternal : projectDetailOwned
  const projectWithTasks = isExternalProject ? projectWithTasksExternal : projectWithTasksOwned

  const customerProfile = isExternalProject
    ? { first_name: (projectDetailExternal as any)?.customer?.first_name, name: (projectDetailExternal as any)?.customer?.name }
    : (projectDetailOwned as any)?.customer?.profile

  const customerEmail: string | undefined = isExternalProject ? undefined : (projectDetailOwned as any)?.customer?.email
  const formatAddress = (a?: AddressResp) => a ? `${a.address_line_1}, ${a.zip_code} ${a.city}, ${a.country}` : ''

  const handleSubmit = (values: any) => {
    if (!user) {
      alert('Vous devez être connecté')
      return
    }

    const effectiveProjectId = initialProjectId || Number(values.project_id)
    const proj = (projects ?? []).find((p) => p.id === effectiveProjectId)
    const autoTitle = proj?.title ? `Devis: ${proj.title}` : `Devis projet ${effectiveProjectId}`
    const payload = {
      title: autoTitle,
      estimate_number: parseInt(values.estimate_number),
      limit_date: values.limit_date,
      project_id: effectiveProjectId,
      entreprise_id: user.id,
      is_validated_by_customer: false,
      payment_type: values.payment_type,
      lines: values.lines,
    }

    createWithLines(payload, {
      onSuccess: () => {
        // Laisse la page parente décider quoi faire après création
        if (onCreated) onCreated()
      },
    })
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col gap-6">
          {/* Champs principaux du devis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Projet</label>
              {initialProjectId ? (
                <input
                  value={(projects ?? []).find(p => p.id === initialProjectId)?.title ?? `Projet #${initialProjectId}`}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 bg-slate-50"
                />
              ) : (
                <Field
                  as="select"
                  name="project_id"
                  className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e: any) => {
                    const pid = Number(e.target.value)
                    setFieldValue('project_id', pid)
                    setCurrentProjectId(pid)
                    const nums = (estimates ?? []).map((est: any) => Number(est.estimate_number)).filter((n) => !Number.isNaN(n))
                    const next = nums.length ? Math.max(...nums) + 1 : 1
                    setFieldValue('estimate_number', String(next))
                  }}
                >
                  <option value={0}>Sélectionner un projet</option>
                  {(projects ?? []).map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </Field>
              )}
              <ErrorMessage name="project_id" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de devis</label>
              <Field name="estimate_number" type="number" className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Auto" readOnly />
              <ErrorMessage name="estimate_number" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date de validité</label>
              <Field name="limit_date" type="date" className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <ErrorMessage name="limit_date" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mode de paiement</label>
              <Field as="select" name="payment_type" className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="cash">Espèces</option>
                <option value="check">Chèque</option>
                <option value="credit_card">Carte bancaire</option>
                <option value="bank_transfer">Virement bancaire</option>
              </Field>
              <ErrorMessage name="payment_type" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            {!!initialProjectId && values.estimate_number === '' && (estimates ?? []).length > 0 && (() => {
              const nums = (estimates ?? []).map((est: any) => Number(est.estimate_number)).filter((n) => !Number.isNaN(n))
              const next = nums.length ? Math.max(...nums) + 1 : 1
              setFieldValue('estimate_number', String(next))
              return null
            })()}
          </div>

          {customerId && (
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Coordonnées du client</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Nom</span>
                  <div className="text-slate-900">{customerProfile ? `${customerProfile.first_name} ${customerProfile.name}` : '—'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Email</span>
                  <div className="text-slate-900">{customerEmail ?? '—'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Téléphone</span>
                  <div className="text-slate-900">{customerProfile?.phone_number ?? '—'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Adresse du chantier</span>
                  <div className="text-slate-900">{formatAddress((projectDetail as any)?.address) || '—'}</div>
                </div>
              </div>
            </div>
          )}


          {/* Liste des lignes de devis avec ajout/suppression et totaux */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-900">Lignes du devis</h3>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const pid = Number((values as any).project_id)
                  if (!pid || pid <= 0) return
                  const allTasks = projectWithTasks?.entreprises?.flatMap((ep: any) => ep.tasks || []) || []
                  const linesFromTasks = allTasks.map((t: any) => ({
                    description: t.title ?? t.description ?? '',
                    quantity: 1,
                    price_per_qty: 0,
                  }))
                  ;(document.activeElement as HTMLElement)?.blur?.()
                  setFieldValue('lines', linesFromTasks)
                }}
              >
                Importer Tâches
              </Button>
            </div>
            <FieldArray name="lines">
              {({ push, remove }) => (
                <div className="flex flex-col gap-4">
                  {values.lines.map((line, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                        <Field name={`lines.${index}.description`} className="w-full px-3 py-2 border rounded-lg border-slate-300 text-sm" placeholder="Description de la prestation" />
                        <ErrorMessage name={`lines.${index}.description`} component="div" className="text-red-500 text-xs" />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Qté</label>
                        <Field name={`lines.${index}.quantity`} type="number" className="w-full px-3 py-2 border rounded-lg border-slate-300 text-sm" />
                        <ErrorMessage name={`lines.${index}.quantity`} component="div" className="text-red-500 text-xs" />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Prix Unitaire</label>
                        <Field name={`lines.${index}.price_per_qty`} type="number" className="w-full px-3 py-2 border rounded-lg border-slate-300 text-sm" />
                        <ErrorMessage name={`lines.${index}.price_per_qty`} component="div" className="text-red-500 text-xs" />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Total</label>
                        <div className="px-3 py-2 text-slate-700 text-sm font-medium">{(line.quantity * line.price_per_qty).toFixed(2)} €</div>
                      </div>
                      <div className="pt-6">
                        <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700" title="Supprimer la ligne">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => push({ description: '', quantity: 1, price_per_qty: 0 })} className="self-start inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800">
                    <Plus size={16} /> Ajouter une ligne
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-4">
            <div className="text-right">
              <span className="text-slate-500 text-sm">Total Devis</span>
              <div className="text-2xl font-bold text-slate-900">
                {values.lines.reduce((acc, line) => acc + (line.quantity * line.price_per_qty), 0).toFixed(2)} €
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              Une erreur est survenue lors de la création du devis : {error.message}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>Annuler</Button>
            <Button type="submit" loading={isPending}>Créer le devis</Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
