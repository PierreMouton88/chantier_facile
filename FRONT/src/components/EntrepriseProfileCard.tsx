import ProfessionPills from "./ProfessionPills";
import Button from "./Buttons";
import type { EntrepriseProfile, Address } from "../types/user.type";


interface EntrepriseProfileCardProps extends EntrepriseProfile {
  email: string;
  addresses: Address[];
  professions: string[];
}

const EntrepriseProfileCard = ({
  company_name,
  siret,
  first_name,
  name,
  phone_number,
  email,
  addresses,
  professions,
}: EntrepriseProfileCardProps) => {
  const address = addresses[0];
  return (
    <section className="w-full max-w-full md:max-w-[70%] lg:max-w-[50%] mx-auto bg-white rounded-none md:rounded-xl shadow-sm border border-slate-200 overflow-hidden px-4 sm:px-6 lg:px-10 py-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-semibold"></div>
          <div className="flex-1">
            <h2 className="text-white text-xl md:text-2xl font-semibold">
              {company_name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/25 px-2.5 py-1 text-sm text-white">
                Entreprise
              </span>
              <span className="inline-flex items-center rounded-full bg-white/25 px-2.5 py-1 text-sm text-white">
                SIRET/SIREN : {siret}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-slate-900 font-medium mb-2">Contact</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Prénom
            </dt>
            <dd className="mt-0.5 text-slate-900">{first_name || "—"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Nom
            </dt>
            <dd className="mt-0.5 text-slate-900">{name || "—"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Email
            </dt>
            <dd className="mt-0.5 text-slate-900">{email || "—"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Téléphone
            </dt>
            <dd className="mt-0.5 text-slate-900">{phone_number || "—"}</dd>
          </div>
        </dl>

        <div className="my-6 h-px bg-slate-200" />

        <h3 className="text-slate-900 font-medium mb-2">Adresse</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border border-slate-200 p-3 col-span-1 lg:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Rue
            </dt>
            <dd className="mt-0.5 text-slate-900">
              {address?.address_line_1 || "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Ville
            </dt>
            <dd className="mt-0.5 text-slate-900">{address?.city || "—"}</dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Code postal
            </dt>
            <dd className="mt-0.5 text-slate-900">
              {address?.zip_code || "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              Pays
            </dt>
            <dd className="mt-0.5 text-slate-900">
              {address?.country || "—"}
            </dd>
          </div>
        </dl>

        <div className="my-6 h-px bg-slate-200" />
        <h3 className="text-slate-900 font-medium mb-2">Corps de métiers</h3>
        <ProfessionPills professions={professions} />
        <div className="pt-8 flex justify-end gap-3">
          <Button variant="secondary" to="/">
            Retour
          </Button>
          <Button to="/profile/edit">Modifier mon profil</Button>
        </div>
      </div>
    </section>
  );
};

export default EntrepriseProfileCard;
