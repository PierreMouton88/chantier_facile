import { Module, forwardRef } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AddressModule } from '../address/address.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    AddressModule,
    UserModule,
    AuthModule,
    forwardRef(() => TaskModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService],
  exports: [ProjectService],
})
export class ProjectModule {}
