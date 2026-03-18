import { Module, forwardRef } from '@nestjs/common';
import { LineService } from './line.service';
import { PrismaService } from '../prisma/prisma.service';
import { EstimateModule } from '../estimate/estimate.module';

@Module({
  imports: [forwardRef(() => EstimateModule)],
  providers: [LineService, PrismaService],
  exports: [LineService],
})
export class LineModule {}
