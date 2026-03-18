import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { Users, Building2, Hammer, Trash2, ShieldCheck } from 'lucide-react'

export default function AdminDashboard() {
  const { data: admin } = useQuery({ queryKey: ['admin-profile'], queryFn: () => authApi.adminProfile(), retry: false })
  const [userId, setUserId] = useState('')
  const del = useMutation({ mutationFn: async () => authApi.adminDeleteUser(Number(userId)) })

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-12 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
            <p className="text-gray-600">Tableau de bord</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-800 ring-1 ring-green-300">
            <ShieldCheck size={16} />
            <span className="text-sm">Accès confirmé</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"><Users className="text-gray-700" size={20} /></div>
            <p className="text-sm text-gray-600">Utilisateurs</p>
            <p className="mt-1 text-2xl font-semibold">—</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"><Building2 className="text-gray-700" size={20} /></div>
            <p className="text-sm text-gray-600">Entreprises</p>
            <p className="mt-1 text-2xl font-semibold">—</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"><Hammer className="text-gray-700" size={20} /></div>
            <p className="text-sm text-gray-600">Projets</p>
            <p className="mt-1 text-2xl font-semibold">—</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Administrateur</p>
            <p className="mt-1 text-lg font-medium text-gray-900">
              {admin?.role !== 'admin' && admin?.profile?.name ? admin.profile.name : '—'}
            </p>
            <p className="text-sm text-gray-600">{admin?.email ?? '—'}</p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              type="number"
              placeholder="ID utilisateur"
              className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={() => del.mutate()}
              disabled={!userId || del.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <Trash2 size={18} />
              Supprimer en cascade
            </button>
          </div>
          {del.isSuccess && <p className="mt-3 text-sm text-green-700">Suppression effectuée</p>}
          {del.isError && <p className="mt-3 text-sm text-red-700">Erreur lors de la suppression</p>}
        </div>
      </section>
    </main>
  )
}
