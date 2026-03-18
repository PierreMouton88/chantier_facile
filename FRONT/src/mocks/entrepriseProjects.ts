const mockProjects = [
  {
    id: 1,
    title: "Rénovation Salle de Bain",
    description: "Remplacement baignoire par douche italienne",
    start_date: "2024-03-15",
    is_finished: false,
    address: {
      address_line_1: "42 Rue des Fleurs",
      city: "Lyon",
      zip_code: "69002"
    },
    // Les entreprises liées à ce projet et leurs tâches
    entreprises: [
      {
        entreprise: { profile: { company_name: "BatiExpert SAS" } },
        tasks: [
          {
            id: 50,
            title: "Dépose de l'ancienne faïence",
            status: "finished",
            start_date: "2024-03-15",
            end_date: "2024-03-16"
          },
          {
            id: 51,
            title: "Installation plomberie douche",
            status: "started",
            start_date: "2024-03-17",
            end_date: "2024-03-19"
          }
        ]
      }
    ]
  }
];
export default mockProjects;