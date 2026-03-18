import { useNavigate } from "react-router-dom"
import CustomerProfileForm from "../components/CustomerProfileForm"
import EntrepriseProfileForm from "../components/EntrepriseProfileForm"
import { useAuthCtx } from "../authContext/AuthContext"
import { useFindUserByIdwithProfile, useUpdateUserProfile, useAddProfessionsToProfile, useRemoveProfessionFromProfile } from "../hooks/useUser"
import { useGetAllProfessions } from "../hooks/useProfession"
import { userApi } from "../api/user.api"

const defaultAddress = { address_line_1: "", zip_code: "", city: "", country: "" }

const EditUserProfile = () => {
  const { user } = useAuthCtx()
  const navigate = useNavigate()

  const { data: userData, isLoading, error } = useFindUserByIdwithProfile(user?.id || 0)
  const { data: allProfessions } = useGetAllProfessions()
  const updateProfile = useUpdateUserProfile()
  const addProfessions = useAddProfessionsToProfile()
  const removeProfession = useRemoveProfessionFromProfile()

  const handleSuccessfulUpdate = () => {
    alert("Mise à jour réussie")
    navigate('/profile')
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur : {error.message}</div>
  }

  if (!userData || userData.role === "admin") {
    return <div>Aucune donnée de profil disponible</div>
  }

  const currentAddress = userData.addresses[0] || defaultAddress

  return (
    <main className="flex items-center">
      <div className="w-full">

        <div className="max-w-full md:max-w-[70%] lg:max-w-[50%] mx-auto px-4 sm:px-6 lg:px-10 mt-10 mb-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Modifier le profil utilisateur
            </h1>
            <p className="text-slate-600 mt-1 text-sm">
              Mets à jour les informations du compte
            </p>
          </header>
        </div>

        <div className="max-w-full md:max-w-[70%] lg:max-w-[50%] mx-auto px-4 sm:px-6 lg:px-10 pb-12">
          {userData.role === "customer" && (
            <CustomerProfileForm
              initial={{ ...userData.profile, address: currentAddress }}
              onSubmit={async (values) => {
                const { id, address, ...profileData } = values
                const { id: addressId, ...addressData } = address || {}

                try {
                  await updateProfile.mutateAsync({
                    profileId: userData.id,
                    userId: userData.id,
                    data: profileData
                  })

                  if (addressId) {
                    await userApi.updateAddress(addressId, addressData)
                  }

                  handleSuccessfulUpdate()
                } catch (err: any) {
                  alert(`Erreur lors de la mise à jour : ${err.message}`)
                }
              }}
            />
          )}

          {userData.role === "entreprise" && (
            <EntrepriseProfileForm
              initial={{ ...userData.profile, address: currentAddress, professions: userData.professions }}
              onSubmit={async (values) => {
                const { id, address, professions, ...profileData } = values
                const { id: addressId, ...addressData } = address || {}

                try {
                  await updateProfile.mutateAsync({
                    profileId: userData.id,
                    userId: userData.id,
                    data: profileData
                  })

                  if (addressId) {
                    await userApi.updateAddress(addressId, addressData)
                  }

                  if (allProfessions && professions) {
                    const oldProfessions = userData.professions || []
                    const newProfessions = professions

                    const toAdd = newProfessions.filter((p: string) => !oldProfessions.includes(p))
                    const toRemove = oldProfessions.filter((p: string) => !newProfessions.includes(p))

                    const professionIdsToAdd = toAdd
                      .map((name: string) => allProfessions.find(p => p.profession_name === name)?.id)
                      .filter((id: number | undefined): id is number => id !== undefined)

                    if (professionIdsToAdd.length > 0) {
                      await addProfessions.mutateAsync({
                        profileId: userData.id,
                        profession_ids: professionIdsToAdd
                      })
                    }

                    for (const professionName of toRemove) {
                      const professionId = allProfessions.find(p => p.profession_name === professionName)?.id
                      if (professionId) {
                        await removeProfession.mutateAsync({
                          profileId: userData.id,
                          professionId
                        })
                      }
                    }
                  }

                  handleSuccessfulUpdate()
                } catch (err: any) {
                  alert(`Erreur lors de la mise à jour : ${err.message}`)
                }
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default EditUserProfile
