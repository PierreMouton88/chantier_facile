import { Module, forwardRef } from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { EstimateController } from './estimate.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { LineModule } from '../line/line.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ProjectModule,
    UserModule,
    forwardRef(() => LineModule),
    AuthModule,
  ],
  controllers: [EstimateController],
  providers: [EstimateService, PrismaService],
  exports: [EstimateService],
})
export class EstimateModule {}
