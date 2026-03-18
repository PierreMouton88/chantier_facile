import {
  type User,
  type CustomerProfile,
  type EntrepriseProfile,
} from "./../types/user.type";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { userApi } from "../api/user.api";

const USERS_QUERY_KEY = "users";

export const useGetAllUsers = (): UseQueryResult<User[], Error> => {
  return useQuery<User[], Error>({
    queryKey: [USERS_QUERY_KEY],
    queryFn: () => userApi.getAllUsers(),
  });
};
export const useGetAllEntreprise = (): UseQueryResult<User[], Error> => {
  return useQuery<User[], Error>({
    queryKey: [USERS_QUERY_KEY],
    queryFn: () => userApi.getAllEntreprise(),
  });
};

export const useFindUserById = (
  id: number
): UseQueryResult<User | null, Error> => {
  return useQuery<User | null, Error>({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: () => userApi.findOne(id),
  });
};

export const useFindUserByIdwithProfile = (
  id: number
): UseQueryResult<User | null, Error> => {
  return useQuery<User | null, Error>({
    queryKey: [USERS_QUERY_KEY, id, "profile"],
    queryFn: () => userApi.getProfile(id),
  });
};

export const useCreateUser = (): UseMutationResult<
  User,
  Error,
  Omit<CustomerProfile | EntrepriseProfile, "id" | "created_at" | "updated_at">
> => {
  const queryClient = useQueryClient();
  return useMutation<
    User,
    Error,
    Omit<
      CustomerProfile | EntrepriseProfile,
      "id" | "created_at" | "updated_at"
    >
  >({
    mutationFn: (body) => userApi.create(body),
    onSuccess: (response) => {
      console.log("Utilisateur créé :", response.email);
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création :", error);
    },
  });
};

// servira a l'admin pour mettre a jour les users/roles, etc.
export const useUpdateUser = (): UseMutationResult<
  User,
  Error,
  { id: number; body: Partial<CustomerProfile | EntrepriseProfile> }
> => {
  const queryClient = useQueryClient();
  return useMutation<
    User,
    Error,
    { id: number; body: Partial<CustomerProfile | EntrepriseProfile> }
  >({
    mutationFn: ({ id, body }) => userApi.update(id, body),
    onSuccess: (response, variables) => {
      console.log("Utilisateur updated :", response.email);
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY, variables.id],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour :", error);
    },
  });
};

export const useDeleteUser = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => userApi.delete(id),
    onSuccess: () => {
      console.log("Utilisateur effacé");
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
};

export const useUpdateUserProfile = (): UseMutationResult<
  CustomerProfile | EntrepriseProfile,
  Error,
  { profileId: number; userId: number; data: Partial<CustomerProfile | EntrepriseProfile> }
> => {
  const queryClient = useQueryClient();
  return useMutation<
    CustomerProfile | EntrepriseProfile,
    Error,
    { profileId: number; userId: number; data: Partial<CustomerProfile | EntrepriseProfile> }
  >({
    mutationFn: ({ profileId, data }) => userApi.updateProfile(profileId, data),
    onSuccess: (_response, variables) => {
      console.log("Profil mis à jour");
      // Invalider le cache du user avec profile
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY, variables.userId, "profile"],
      });
      // Invalider aussi le cache simple si il existe
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY, variables.userId],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du profil :", error);
    },
  });
};

// Gestion des professions du profil
export const useAddProfessionsToProfile = (): UseMutationResult<
  void,
  Error,
  { profileId: number; profession_ids: number[] }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, profession_ids }) =>
      userApi.addProfessionsToProfile(profileId, profession_ids),
    onSuccess: () => {
      console.log("Professions ajoutées au profil");
      // Invalider tous les users car le profil est inclus dans le user
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout des professions :", error);
    },
  });
};

export const useRemoveProfessionFromProfile = (): UseMutationResult<
  void,
  Error,
  { profileId: number; professionId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, professionId }) =>
      userApi.removeProfessionFromProfile(profileId, professionId),
    onSuccess: () => {
      console.log("Profession retirée du profil");
      // Invalider tous les users car le profil est inclus dans le user
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la profession :", error);
    },
  });
};
