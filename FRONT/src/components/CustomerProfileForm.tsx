import { useForm } from "react-hook-form";
import Field from "./FormField";
import Button from "./Buttons";
import type { CustomerProfile, Address } from "../types/user.type";

type FormData = CustomerProfile & { address: Address }

export default function CustomerProfileForm({
  initial,
  onSubmit,
}: {
  initial: FormData;
  onSubmit: (values: FormData) => void;
}) {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: initial,
  });

  const submit = handleSubmit((data) => onSubmit(data));

  return (
    <section className="w-full max-w-full md:max-w-[70%] lg:max-w-[50%] mx-auto bg-white rounded-none md:rounded-xl shadow-sm border border-slate-200 overflow-hidden px-4 sm:px-6 lg:px-10 py-6">
      <div className="-mx-4 sm:-mx-6 lg:-mx-10 -mt-6 mb-6 bg-gradient-to-r from-blue-600 to-blue-400 p-6">
        <h2 className="text-white text-xl md:text-2xl font-semibold">
          Modifier le profil client
        </h2>
        <p className="text-blue-100 text-sm mt-1">
          Mets à jour les informations du compte
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <h3 className="text-slate-900 font-medium">Informations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Prénom">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("first_name")}
            />
          </Field>
          <Field label="Nom">
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

        <h3 className="text-slate-900 font-medium">Adresse</h3>
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

        <div className="pt-8 flex flex-wrap gap-3 justify-end">
          <Button variant="secondary" to="/profile">
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </section>
  );
}
