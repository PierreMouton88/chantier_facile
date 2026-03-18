import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Field from "./FormField";
import ProfessionPillsPicker from "./ProfessionPillsPicker";
import Button from "./Buttons";
import type { EntrepriseProfile, Address } from "../types/user.type";
import { useGetAllProfessions } from "../hooks/useProfession";

type FormData = EntrepriseProfile & { address: Address; professions: string[] }

export default function EntrepriseProfileForm({
  initial,
  onSubmit,
}: {
  initial: FormData;
  onSubmit: (values: FormData) => void;
}) {
  const { register, handleSubmit, reset, control } = useForm<FormData>(
    {
      defaultValues: initial,
    }
  );
  useEffect(() => {
    reset(initial);
  }, [initial, reset]);
  const {data: professionsList } = useGetAllProfessions()
  const submit = handleSubmit((data) => onSubmit(data));

  return (
    <section className="w-full mx-auto bg-white rounded-none md:rounded-xl shadow-sm border border-slate-200 overflow-hidden px-4 sm:px-6 lg:px-10 py-6">
      <div className="px-0 py-0">
        <h2 className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white text-xl md:text-2xl font-semibold mb-6 rounded-none">
          Informations entreprise
        </h2>
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Raison sociale">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("company_name")}
              />
            </Field>
            <Field label="SIRET / SIREN">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("siret")}
              />
            </Field>
            <Field label="Prénom contact">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("first_name")}
              />
            </Field>
            <Field label="Nom contact">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("name")}
              />
            </Field>
            <Field label="Téléphone">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("phone_number")}
              />
            </Field>
          </div>

          <div className="my-6 h-px bg-slate-200" />

          <h3 className="text-slate-900 font-medium mb-2">Adresse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Rue" className="lg:col-span-2">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("address.address_line_1")}
              />
            </Field>
            <Field label="Ville">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("address.city")}
              />
            </Field>
            <Field label="Code postal">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("address.zip_code")}
              />
            </Field>
            <Field label="Pays">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("address.country")}
              />
            </Field>
          </div>

          <div className="my-6 h-px bg-slate-200" />

          <h3 className="text-slate-900 font-medium mb-2">Corps de métiers</h3>
          <Controller
            control={control}
            name="professions"
            render={({ field: { value = [], onChange } }) => (
              <ProfessionPillsPicker
                options={professionsList}
                value={value}
                onChange={onChange}
              />
            )}
          />

          {/* Actions */}
          <div className="pt-8 flex flex-wrap gap-3 justify-end">
            <Button variant="secondary" to="/profile">
              Annuler
            </Button>

            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
