
export type ProjectEntreprise = {
  id: string;
  name?: string;
  customerName?: string;
  place?: string;
  trade?: string;
  delay?: string;
  tasks?: number;
  status?: string;
};


export const projectsEntreprise: any[] = [
  {
    id: "1",
    name: "Titre du chantier Alpha",
    customerName: "Client A",
    place: "Maison Dubois",
    trade: "Menuiserie",
    delay: "20/12/2024",
    tasks: 3,
  },
  {
    id: "2",
    name: "Titre du chantier Beta qui veut allez plus loin ",
    customerName: "Client B",
    place: "Appartement Z",
    trade: "Plomberie",
    delay: "15/01/2025",
    tasks: 4,
  },
  {
    id: "3",
    name: "Titre du chantier Gamma",
    customerName: "Client C",
    place: "Bureau HQ",
    trade: "Électricité",
    delay: "05/03/2025",
    tasks: 2,
  },
];