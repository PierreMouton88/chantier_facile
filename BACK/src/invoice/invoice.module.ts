import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EstimateModule } from '../estimate/estimate.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EstimateModule, AuthModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
