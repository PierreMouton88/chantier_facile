import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserDeletionService {
  constructor(private prisma: PrismaService) {}

  async deleteUserCascade(userId: number) {
    await this.prisma.$transaction(async (prismaTx) => {
      // Supprime les professions liées au user
      await prismaTx.userHasProfession.deleteMany({
        where: { user_id: userId },
      });

      // Supprime les adresses liées au user
      await prismaTx.userHasAddresses.deleteMany({
        where: { user_id: userId },
      });

      // Supprime les notifications reçues par l'utilisateur
      await prismaTx.userReceivesNotifications.deleteMany({
        where: { user_id: userId },
      });

      // Supprime tous les refresh tokens de l'utilisateur
      await prismaTx.refreshToken.deleteMany({ where: { user_id: userId } });

      // Filtre projets où l'utilisateur est client
      const projectCustomerFilter = { customer_id: userId };

      // Filtre les entrepriseHasProjects où l'utilisateur est entreprise
      const entrepriseProjectFilter = { entreprise_id: userId };

      // Supprime les professions liées aux tâches des entrepriseHasProjects du user
      await prismaTx.taskHasProfession.deleteMany({
        where: {
          task: {
            entrepriseProject: {
              OR: [{ project: projectCustomerFilter }, entrepriseProjectFilter],
            },
          },
        },
      });

      // Supprime les tâches liées aux entrepriseHasProjects du user
      await prismaTx.task.deleteMany({
        where: {
          entrepriseProject: {
            OR: [{ project: projectCustomerFilter }, entrepriseProjectFilter],
          },
        },
      });

      // Supprime les entrepriseHasProjects du user
      await prismaTx.entrepriseHasProjects.deleteMany({
        where: {
          OR: [{ project: projectCustomerFilter }, entrepriseProjectFilter],
        },
      });

      // Supprime les factures et lignes liées aux devis du user ou de ses projets
      await prismaTx.invoice.deleteMany({
        where: {
          OR: [
            { estimate: { project: projectCustomerFilter } },
            { estimate: { entreprise_id: userId } },
          ],
        },
      });
      await prismaTx.line.deleteMany({
        where: {
          OR: [
            { estimate: { project: projectCustomerFilter } },
            { estimate: { entreprise_id: userId } },
          ],
        },
      });

      // Supprime les devis liés aux projets du user ou créés par le user
      await prismaTx.estimate.deleteMany({
        where: {
          OR: [{ project: projectCustomerFilter }, { entreprise_id: userId }],
        },
      });

      // Supprime les projets où l'utilisateur est customer
      await prismaTx.project.deleteMany({ where: projectCustomerFilter });

      // Supprime le profil (1:1)
      await prismaTx.profile.deleteMany({ where: { user_id: userId } });

      // Supprime l'utilisateur lui-même
      await prismaTx.user.delete({ where: { id: userId } });
    });
  }
}
