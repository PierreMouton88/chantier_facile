# Impact Front-End — Refacto Back

Ce document liste **tous les changements côté front** nécessaires suite à la refacto du backend.

---

## 1. Renommages de champs

### Profile (CustomerProfile / EntrepriseProfile)

| Ancien nom       | Nouveau nom     | Fichiers front impactés |
|------------------|-----------------|------------------------|
| `firstName`      | `first_name`    | `types/user.type.ts`, `types/auth.type.ts`, `components/CustomerProfileForm.tsx`, `components/EntrepriseProfileForm.tsx`, `components/CustomerProfileCard.tsx`, `components/EntrepriseProfileCard.tsx` |
| `telephone`      | `phone_number`  | Mêmes fichiers que ci-dessus |
| `raisonSociale`  | `company_name`  | `types/user.type.ts`, `types/auth.type.ts`, `components/EntrepriseProfileForm.tsx`, `components/EntrepriseProfileCard.tsx` |

### Signup payloads

| Ancien nom       | Nouveau nom     | Fichiers front impactés |
|------------------|-----------------|------------------------|
| `firstName`      | `first_name`    | `components/Authentification/signupUser.tsx` (payload ligne ~49), `components/Authentification/signupEntreprise.tsx` (payload ligne ~63) |
| `telephone`      | `phone_number`  | Mêmes fichiers |
| `raisonSociale`  | `company_name`  | `components/Authentification/signupEntreprise.tsx` |

### Estimate / Invoice

| Ancien nom | Nouveau nom | Fichiers front impactés |
|------------|-------------|------------------------|
| `object`   | `title`     | `types/estimate.type.ts`, `types/invoice.type.ts`, `components/Devis/CreateDevisForm.tsx`, `components/Devis/EstimateList.tsx`, `hooks/useEstimate.ts`, `hooks/useInvoice.ts` |

### Estimate — user_id → entreprise_id

| Ancien nom | Nouveau nom     | Fichiers front impactés |
|------------|-----------------|------------------------|
| `user_id`  | `entreprise_id` | `types/estimate.type.ts` (CreateEstimateDto), `components/Devis/CreateDevisForm.tsx` (payload) |

---

## 2. Champs supprimés

### Line — subtotal supprimé

Le champ `subtotal` n'existe plus côté back (calculé à la volée).

**Fichiers impactés :**
- `types/line.type.ts` — retirer `subtotal` du type `Line`
- `types/estimate.type.ts` — retirer `subtotal` des lignes dans `Estimate` et `CreateEstimateDto`
- `components/Devis/CreateDevisForm.tsx` — ne plus envoyer `subtotal` dans le payload (ligne ~73 : `subtotal: line.quantity * line.price_per_qty` → à supprimer)
- `components/Devis/EstimateList.tsx` — ne plus afficher `line.subtotal` (ligne ~96), calculer `quantity * price_per_qty` côté front si besoin d'afficher

### Project — entreprise_id supprimé du create

Le champ `entreprise_id` n'est plus dans le DTO de création de projet (la liaison se fait via la table de junction `EntrepriseHasProjects`).

**Fichiers impactés :**
- `types/projects.type.ts` — retirer `entreprise_id` du type `Project` (ou le rendre optionnel, il peut encore venir en lecture)
- `pages/projets/ProjectForm.page.tsx` — retirer `entreprise_id: 88` du formData (ligne ~24, c'était hardcodé)

---

## 3. Changements de structure

### Profile : 1:N → 1:1

Avant : `user.profiles[0]` (tableau)
Maintenant : `user.profile` (objet direct)

**Fichiers impactés :**
- `types/user.type.ts` — le type `User` utilise déjà `profile` (pas `profiles`), donc OK si le front lisait déjà `.profile`
- Vérifier partout où le front accède au profil que c'est bien `.profile` et non `.profiles[0]`

### User response : ajout `professions`

Le endpoint `/auth/me` (et `getcompleteUser`) renvoie maintenant :
```json
{
  "id": 1,
  "email": "...",
  "role": "entreprise",
  "profile": { ... },
  "professions": ["Plombier", "Électricien"]
}
```

**Fichiers impactés :**
- `types/user.type.ts` — ajouter `professions: string[]` sur `EntrepriseProfile` (ou sur `User` directement, c'est au niveau user maintenant, pas profile)

### Task : user_id/project_id → entreprise_project_id

Les tâches sont maintenant liées à un `entreprise_project_id` (clé vers `EntrepriseHasProjects`) au lieu de `user_id` + `project_id` directement.

**Fichiers impactés :**
- `types/task.type.ts` — remplacer `user_id` et `project_id` par `entreprise_project_id: number | null`
- `pages/tasks/TaskForm.page.tsx` — adapter le formulaire de création de tâche
- `components/Devis/CreateDevisForm.tsx` — appel `projectApi.getAllTasksbyProjectId(pid)` (cette méthode n'existe pas dans project.api.ts, à vérifier/créer)

---

## 4. Résumé par fichier front

| Fichier | Modifications |
|---------|--------------|
| `types/user.type.ts` | `firstName` → `first_name`, `telephone` → `phone_number`, `raisonSociale` → `company_name`, ajouter `professions` au bon endroit |
| `types/auth.type.ts` | `firstName` → `first_name`, `telephone` → `phone_number`, `raisonSociale` → `company_name` |
| `types/estimate.type.ts` | `object` → `title`, `user_id` → `entreprise_id`, retirer `subtotal` |
| `types/invoice.type.ts` | `object` → `title` |
| `types/line.type.ts` | Retirer `subtotal` |
| `types/task.type.ts` | `user_id` + `project_id` → `entreprise_project_id` |
| `types/projects.type.ts` | Retirer `entreprise_id` du create (garder en lecture si besoin) |
| `components/Authentification/signupUser.tsx` | Payload : `firstName` → `first_name`, `telephone` → `phone_number` |
| `components/Authentification/signupEntreprise.tsx` | Payload : `firstName` → `first_name`, `telephone` → `phone_number`, `raisonSociale` → `company_name` |
| `components/Devis/CreateDevisForm.tsx` | `object` → `title`, `user_id` → `entreprise_id`, retirer `subtotal` du payload |
| `components/Devis/EstimateList.tsx` | `estimate.object` → `estimate.title`, retirer `line.subtotal` |
| `components/CustomerProfileForm.tsx` | `firstName` → `first_name`, `telephone` → `phone_number` |
| `components/EntrepriseProfileForm.tsx` | `raisonSociale` → `company_name`, `firstName` → `first_name`, `telephone` → `phone_number` |
| `components/CustomerProfileCard.tsx` | Mêmes renommages (affichage) |
| `components/EntrepriseProfileCard.tsx` | Mêmes renommages (affichage) |
| `hooks/useEstimate.ts` | `response.object` → `response.title` dans les logs |
| `hooks/useInvoice.ts` | `response.object` → `response.title` dans les logs |
| `pages/projets/ProjectForm.page.tsx` | Retirer `entreprise_id` du formData |
| `pages/tasks/TaskForm.page.tsx` | Adapter pour `entreprise_project_id` |

---

## 5. Points d'attention

1. **`address`** : le profil ne porte plus d'`address` directement. Les adresses sont liées via `UserHasAddresses`. Si le front affiche l'adresse du profil, il faudra la récupérer depuis `user.addresses[0].address` au lieu de `profile.address`.

2. **`professions`** : les professions sont maintenant au niveau user (pas profile). Le front qui affichait `profile.professions` doit lire `user.professions`.

3. **`subtotal`** : si le front a besoin d'afficher un sous-total par ligne, il doit le calculer lui-même : `quantity * price_per_qty`.

4. **Formulaire projet** : `entreprise_id: 88` est hardcodé dans `ProjectForm.page.tsx`. Ce champ n'existe plus dans le DTO. La liaison entreprise ↔ projet se fera via un appel séparé ou un autre mécanisme à définir.

5. **`getAllTasksbyProjectId`** : cette méthode est appelée dans `CreateDevisForm.tsx` mais n'existe pas dans `project.api.ts`. À vérifier si c'est un bug existant ou si elle doit être créée.
