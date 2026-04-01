import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/AdminDashboard'
import { PublicLayout } from './layouts/PublicLayout'
import { NotFoundPage } from './routes/NotFoundPage'
import { PrivateLayout } from './layouts/PrivateLayout'
import Home from './pages/Home'
import EditUserProfile from './pages/EditUserProfile'
import { CreateTask } from './components/Projects/Tasks/TaskForm'
import LoginPage from './pages/signin'
import SignUpEntreprise from './components/Authentification/signupEntreprise'
import SignUpUser from './components/Authentification/signupUser'
import { PublicRoute, PrivateRoute, PrivateAdminRoute, PrivateUserRoute, PrivateEntrepriseRoute } from './routes/PrivateRoleRoute'
import Documents from './pages/Documents'
import CreateDevis from './pages/CreateDevis'
import Devis from './pages/Devis'
import Factures from './pages/Factures'
import ProjectSearch from './pages/projets/ProjectSearch'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ProjectForm } from './pages/projets/ProjectForm.page'
import PageDashboard from './pages/PageDashboard'
import { EditTaskPage } from './pages/tasks/TaskEditForm.page'
import { CreateTaskPage } from './pages/tasks/TaskCreateForm.page'
import { Contact } from 'lucide-react'
import CalendarPage from './pages/calendar/Calendar.page'
import DirectoryPage from './pages/directory/Directory.page'
import { PageProjets } from './pages/projets/Projects.page'
import { useAuthInit } from './hooks/useAuthInit'

function App() {
  useAuthInit()

  return (
    <>
      <Routes>
        {/* Routes publiques */}
        <Route element={<PublicRoute />}>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup-entreprise" element={<SignUpEntreprise />} />
            <Route path="/signupUser" element={<SignUpUser />} />
          </Route>
        </Route>

        {/* Routes privées */}
        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<PageDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/edit" element={<EditUserProfile />} />
            <Route path="/notification" element={<PageDashboard />} />
            <Route path="/planning" element={<CalendarPage />} />
            <Route path="/projets" element={<PageProjets />} />
            <Route path="/projets/new/project" element={<ProjectForm />} />
            <Route path="/project/edit/:id" element={<ProjectForm />} />
            <Route path="/projets/:projectId/tasks/new" element={<CreateTaskPage />} />
            <Route path="/projets/:projectId/tasks/edit/:taskId" element={<EditTaskPage />} />
            <Route path="/projets/:id/new" element={<CreateTask />} />
            <Route path="/projets/:id/devis/new" element={<CreateDevis />} />
            <Route path="/documents" element={<Documents />}>
              <Route index element={<Navigate to="/documents/devis" replace />} />
              <Route path="devis" element={<Devis />} />
              <Route path="devis/new" element={<CreateDevis />} />
              <Route path="factures" element={<Factures />} />
            </Route>
          </Route>
        </Route>

        {/* Customer uniquement - Annuaire entreprises */}
        <Route element={<PrivateUserRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/annuaire" element={<DirectoryPage />} />
          </Route>
        </Route>

        {/* Entreprise uniquement - Recherche chantiers */}
        <Route element={<PrivateEntrepriseRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/chantiers" element={<ProjectSearch />} />
          </Route>
        </Route>

        {/* Admin uniquement */}
        <Route element={<PrivateAdminRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
