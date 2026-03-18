import { PrismaClient, Profession, User, Address, Project, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type CustomerData = {
  user: User;
  address: Address;
};

type EntrepriseData = {
  user: User;
  address: Address;
};

type ProjectData = {
  project: Project;
  address: Address;
};

async function main() {
  console.log('🌱 Début du seeding...');

  await prisma.userReceivesNotifications.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.line.deleteMany({});
  await prisma.estimate.deleteMany({});
  await prisma.taskHasProfession.deleteMany({});
  await prisma.userHasProfession.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.entrepriseHasProjects.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.userHasAddresses.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.profession.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Base de données nettoyée');

  const now = new Date();
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const professionNames = [
    "Maçonnerie", "Gros œuvre", "Charpente", "Couverture", "Zinguerie",
    "Étanchéité", "Plomberie", "Chauffage", "Climatisation", "Ventilation (CVC)",
    "Électricité", "Domotique", "Menuiserie intérieure", "Menuiserie extérieure", "Isolation",
    "Cloisons / Placo", "Peinture", "Revêtements sols", "Carrelage / Faïence", "Parquet",
    "Serrurerie / Métallerie", "Vitrerie", "Plâtrerie", "Terrassement", "VRD",
    "Paysagisme", "Piscine", "Ferronnerie", "Ascenseur / Monte-charge", "Contrôle d'accès",
    "Alarme / Sécurité", "Photovoltaïque", "Pompe à chaleur", "Désamiantage", "Dépollution",
    "Ravalement de façade", "Traitement de toiture", "Charpente métallique", "Ebénisterie", "Staff / Stuc",
    "Gypse / Enduits", "Antennes / Courants faibles", "Bardage", "Chapes / Ragréage", "Béton décoratif",
    "Portes / Portails automatiques", "Stores / Volets", "Génie civil léger",
  ];

  const professions: Profession[] = [];
  for (const professionName of professionNames) {
    const profession = await prisma.profession.create({
      data: { profession_name: professionName, created_at: now, updated_at: now },
    });
    professions.push(profession);
  }
  console.log(`✅ ${professions.length} Professions créées`);

  const cities = [
    { name: 'Paris', zip: '75001' },
    { name: 'Paris', zip: '75008' },
    { name: 'Paris', zip: '75015' },
    { name: 'Lyon', zip: '69001' },
    { name: 'Lyon', zip: '69003' },
    { name: 'Lyon', zip: '69006' },
    { name: 'Marseille', zip: '13001' },
    { name: 'Marseille', zip: '13008' },
    { name: 'Toulouse', zip: '31000' },
    { name: 'Toulouse', zip: '31200' },
    { name: 'Bordeaux', zip: '33000' },
    { name: 'Bordeaux', zip: '33300' },
    { name: 'Lille', zip: '59000' },
    { name: 'Nice', zip: '06000' },
    { name: 'Nantes', zip: '44000' },
    { name: 'Strasbourg', zip: '67000' },
    { name: 'Montpellier', zip: '34000' },
    { name: 'Rennes', zip: '35000' },
  ];

  const customerNames = [
    { first_name: 'Jean', name: 'Dupont' },
    { first_name: 'Marie', name: 'Bernard' },
    { first_name: 'Pierre', name: 'Dubois' },
    { first_name: 'Sophie', name: 'Leroy' },
    { first_name: 'Luc', name: 'Moreau' },
    { first_name: 'Anne', name: 'Simon' },
    { first_name: 'Paul', name: 'Laurent' },
    { first_name: 'Claire', name: 'Lefebvre' },
    { first_name: 'Marc', name: 'Michel' },
    { first_name: 'Julie', name: 'Garcia' },
  ];

  const companyNames = [
    'Martin Constructions', 'Lefebvre Électricité', 'Dubois Plomberie', 'Roux Rénovation',
    'Petit Maçonnerie', 'Garnier Isolation', 'Lambert Chauffage', 'Bonnet Peinture',
    'François Carrelage', 'Blanc Menuiserie', 'Guerin Couverture', 'Rousseau Plâtrerie',
    'Vincent Terrassement', 'Morel Climatisation', 'Fournier Serrurerie', 'Girard Vitrerie',
    'André Ravalement', 'Mercier Charpente', 'Durand Étanchéité', 'Bertrand Photovoltaïque',
    'Robert Piscine', 'Richard Domotique', 'Lefevre VRD', 'Moreau Paysagisme',
    'Simon Ferronnerie', 'Laurent Alarme', 'Michel Parquet', 'Garcia Stores',
    'Martinez Pompe à chaleur', 'Rodriguez Bardage',
  ];

  const customers: CustomerData[] = [];
  for (let i = 0; i < 10; i++) {
    const city = cities[i % cities.length];
    const user = await prisma.user.create({
      data: {
        email: `customer${i + 1}@test.com`,
        password: hashedPassword,
        role: 'customer',
        is_validated: true,
        created_at: now,
        updated_at: now,
      },
    });

    const address = await prisma.address.create({
      data: {
        address_line_1: `${10 + i} Rue du Client`,
        zip_code: city.zip,
        city: city.name,
        country: 'France',
        created_at: now,
        updated_at: now,
      },
    });

    await prisma.profile.create({
      data: {
        user_id: user.id,
        name: customerNames[i].name,
        first_name: customerNames[i].first_name,
        phone_number: `060${String(i).padStart(7, '0')}`,
        is_newbie: i % 3 === 0,
        created_at: now,
        updated_at: now,
      },
    });

    await prisma.userHasAddresses.create({
      data: { user_id: user.id, address_id: address.id, created_at: now, updated_at: now },
    });

    customers.push({ user, address });
  }
  console.log(`✅ ${customers.length} Customers créés`);

  const entreprises: EntrepriseData[] = [];
  for (let i = 0; i < 30; i++) {
    const city = cities[i % cities.length];
    const user = await prisma.user.create({
      data: {
        email: `entreprise${i + 1}@test.com`,
        password: hashedPassword,
        role: 'entreprise',
        is_validated: true,
        created_at: now,
        updated_at: now,
      },
    });

    const address = await prisma.address.create({
      data: {
        address_line_1: `${20 + i} Avenue de l'Entreprise`,
        zip_code: city.zip,
        city: city.name,
        country: 'France',
        created_at: now,
        updated_at: now,
      },
    });

    await prisma.profile.create({
      data: {
        user_id: user.id,
        name: `Contact${i + 1}`,
        first_name: `Prénom${i + 1}`,
        phone_number: `061${String(i).padStart(7, '0')}`,
        is_newbie: i > 20,
        company_name: companyNames[i],
        siret: `${12345678901234 + i}`,
        created_at: now,
        updated_at: now,
      },
    });

    await prisma.userHasAddresses.create({
      data: { user_id: user.id, address_id: address.id, created_at: now, updated_at: now },
    });

    const numProfessions = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...professions].sort(() => 0.5 - Math.random());
    for (let j = 0; j < numProfessions; j++) {
      await prisma.userHasProfession.create({
        data: {
          user_id: user.id,
          profession_id: shuffled[j].id,
          created_at: now,
          updated_at: now,
        },
      });
    }

    entreprises.push({ user, address });
  }
  console.log(`✅ ${entreprises.length} Entreprises créées`);

  const projectTitles = [
    'Rénovation salle de bain', 'Installation électrique', 'Construction muret jardin',
    'Remplacement chaudière', 'Isolation combles', 'Pose carrelage cuisine',
    'Peinture appartement', 'Installation climatisation', 'Réfection toiture',
    'Création terrasse bois', 'Aménagement grenier', 'Installation cuisine équipée',
    'Pose parquet salon', 'Ravalement façade', 'Installation VMC double flux',
    'Rénovation hall entrée', 'Pose fenêtres PVC', 'Installation poêle à bois',
    'Aménagement salle de sport', 'Construction véranda', 'Installation pompe à chaleur',
    'Pose volets roulants', 'Rénovation escalier', 'Installation douche italienne',
    'Aménagement bureau', 'Pose porte blindée', 'Installation alarme', 'Rénovation garage',
    'Construction abri jardin', 'Installation chauffe-eau solaire', 'Pose portail automatique',
    'Rénovation chambre', 'Installation domotique', 'Aménagement cave à vin',
    'Construction piscine', 'Installation spa', 'Rénovation séjour', 'Pose store banne',
    'Aménagement dressing', 'Installation borne électrique', 'Rénovation WC',
    'Pose clôture jardin', 'Installation système arrosage', 'Rénovation balcon',
    'Construction mezzanine', 'Installation cheminée', 'Rénovation sous-sol',
    'Pose baie vitrée', 'Aménagement combles perdus', 'Installation récupérateur eau pluie',
  ];

  const projects: ProjectData[] = [];
  for (let i = 0; i < 50; i++) {
    const city = cities[i % cities.length];
    const customer = customers[i % customers.length];
    const projectAddress = await prisma.address.create({
      data: {
        address_line_1: `${100 + i} Rue du Projet`,
        zip_code: city.zip,
        city: city.name,
        country: 'France',
        created_at: now,
        updated_at: now,
      },
    });

    const startDate = new Date(now.getTime() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
    const isFinished = i % 4 === 0;

    const project = await prisma.project.create({
      data: {
        title: projectTitles[i],
        description: `Description détaillée du projet ${projectTitles[i]}`,
        start_date: startDate,
        address_id: projectAddress.id,
        customer_id: customer.user.id,
        is_finished: isFinished,
        created_at: now,
        updated_at: now,
      },
    });

    projects.push({ project, address: projectAddress });
  }
  console.log(`✅ ${projects.length} Projets créés`);

  const taskTemplates = [
    'Préparation du chantier', 'Démolition existant', 'Évacuation gravats',
    'Traçage et mesures', 'Approvisionnement matériel', 'Pose rails/montants',
    'Installation équipement', 'Raccordements', 'Tests et mise en service',
    'Finitions', 'Nettoyage chantier', 'Réception travaux',
    'Isolation thermique', 'Isolation phonique', 'Pose du revêtement',
    'Application primaire', 'Application finition', 'Protection surfaces',
    'Vérification conformité', 'Documentation technique',
  ];

  const statuses: TaskStatus[] = ['pending', 'started', 'finished', 'stopped'];

  let totalEntrepriseProjects = 0;
  let totalTasks = 0;

  for (const projectData of projects) {
    const numEntreprises = Math.floor(Math.random() * 3) + 1;
    const shuffledEntreprises = [...entreprises].sort(() => 0.5 - Math.random());

    for (let i = 0; i < numEntreprises; i++) {
      const entreprise = shuffledEntreprises[i];

      const entrepriseProject = await prisma.entrepriseHasProjects.create({
        data: {
          entreprise_id: entreprise.user.id,
          project_id: projectData.project.id,
          created_at: now,
          updated_at: now,
        },
      });
      totalEntrepriseProjects++;

      const numTasks = Math.floor(Math.random() * 4) + 2;
      const shuffledTasks = [...taskTemplates].sort(() => 0.5 - Math.random());

      for (let j = 0; j < numTasks; j++) {
        const status = projectData.project.is_finished
          ? (Math.random() > 0.2 ? 'finished' : statuses[Math.floor(Math.random() * statuses.length)])
          : statuses[Math.floor(Math.random() * 3)];

        const taskStartDate = new Date(projectData.project.start_date.getTime() + j * 7 * 24 * 60 * 60 * 1000);
        const taskEndDate = new Date(taskStartDate.getTime() + (Math.floor(Math.random() * 14) + 7) * 24 * 60 * 60 * 1000);

        const task = await prisma.task.create({
          data: {
            title: shuffledTasks[j],
            description: `${shuffledTasks[j]} - ${projectData.project.title}`,
            status: status,
            start_date: taskStartDate,
            end_date: taskEndDate,
            entreprise_project_id: entrepriseProject.id,
            created_at: now,
            updated_at: now,
          },
        });

        const numTaskProfessions = Math.floor(Math.random() * 2) + 1;
        const shuffledProfessions = [...professions].sort(() => 0.5 - Math.random());
        for (let k = 0; k < numTaskProfessions; k++) {
          await prisma.taskHasProfession.create({
            data: {
              task_id: task.id,
              profession_id: shuffledProfessions[k].id,
              created_at: now,
              updated_at: now,
            },
          });
        }

        totalTasks++;
      }
    }
  }

  console.log(`✅ ${totalEntrepriseProjects} Assignations entreprise-projet créées`);
  console.log(`✅ ${totalTasks} Tâches créées`);

  console.log('');
  console.log('🎉 Seeding terminé avec succès !');
  console.log('🔑 Credentials pour se connecter :');
  console.log('   Customers: customer1@test.com à customer10@test.com / Password123!');
  console.log('   Entreprises: entreprise1@test.com à entreprise30@test.com / Password123!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
