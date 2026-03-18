interface ProfessionPillsProps {
  professions?: string[];
}

const ProfessionPills = ({ professions }: ProfessionPillsProps) => {
  if (!professions || professions.length === 0) {
    return <span className="text-slate-500">Aucun métier renseigné</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {professions.map((profession, index) => (
        <span
          key={`${profession}-${index}`}
          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800"
        >
          {profession}
        </span>
      ))}
    </div>
  );
};

export default ProfessionPills;
