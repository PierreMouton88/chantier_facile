# Refacto Back - Progression

## Statut : Étape 3 TERMINÉE (build OK)

### Fichiers modifiés
- `src/line/dto/create-line.dto.ts` - supprimé subtotal
- `src/line/line.service.ts` - supprimé calcul subtotal
- `src/line/entities/line.entity.ts` - supprimé subtotal
- `src/invoice/dto/create-invoice.dto.ts` - object → title
- `src/estimate/dto/create-estimate.dto.ts` - object → title, user_id → entreprise_id
- `src/estimate/dto/create-estimate-with-lines.dto.ts` - idem + OmitType nettoyé
- `src/estimate/estimate.service.ts` - object → title, user_id → entreprise_id, subtotal supprimé
- `src/estimate/estimate.controller.ts` - vérifs user_id → entreprise_id
- `src/profile/dto/create-profile.dto.ts` - firstName → first_name, telephone → phone_number, raisonSociale → company_name, supprimé address_id
- `src/profile/dto/update-profile.dto.ts` - mêmes renommages, supprimé bloc address
- `src/profile/dto/profile-response.dto.ts` - renommages, supprimé address et skills transform
- `src/profile/profile.service.ts` - findOne(user_id), supprimé logique address, profileHasProfession → userHasProfession
- `src/profile/profile.controller.ts` - supprimé vérif address_id, retiré AddressService
- `src/profile/profile.module.ts` - retiré AddressModule
- `src/task/dto/create-task.dto.ts` - supprimé user_id/project_id, ajouté entreprise_project_id
- `src/task/entities/task.entity.ts` - idem
- `src/task/task.controller.ts` - simplifié, retiré ProjectService/UserService
- `src/task/task.module.ts` - retiré imports ProjectModule/UserModule
- `src/project/dto/create-project.dto.ts` - supprimé entreprise_id
- `src/project/project.service.ts` - create sans entreprise_id, findOneWithTask via entreprises, findAllByUserId via junction
- `src/project/project.controller.ts` - supprimé vérif entreprise_id, routes task adaptées
- `src/auth/dto/signup.dto.ts` - firstName → first_name, telephone → phone_number, raisonSociale → company_name
- `src/auth/auth.service.ts` - profile nouveaux noms, ajout userHasAddresses, profileHasProfession → userHasProfession
- `src/auth/dto/user-with-profile.dto.ts` - profiles[0] → profile (1:1), ajout professions
- `src/user/user.service.ts` - getcompleteUser include adapté
- `src/user/services/user-deletion.service.ts` - cascade refacto complet
- `src/auth/guards/resource-access.guard.ts` - ownership check via junction table
- `src/auth/decorators/resource-access.decorator.ts` - nettoyé ownerFields, supprimé TaskOwnerOrAdmin
- `src/app.module.ts` - retiré ProfileHasProfessionModule

### Supprimé
- `src/profile_has_profession/` (dossier entier)

## Étapes suivantes
- [ ] Log d'impact front (étape 4)
- [ ] Diagnostic sécurité auth (étape 5)
