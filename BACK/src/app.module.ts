import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { PrismaModule } from './prisma/prisma.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LineModule } from './line/line.module';
import { EstimateModule } from './estimate/estimate.module';
import { TaskHasProfessionModule } from './task_has_profession/task_has_profession.module';
import { ProfessionModule } from './profession/profession.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    AddressModule,
    ProjectModule,
    TaskModule,
    ProfessionModule,
    TaskHasProfessionModule,
    EstimateModule,
    LineModule,
    InvoiceModule,
    UserModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
