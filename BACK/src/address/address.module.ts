import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AddressController],
  providers: [AddressService, PrismaService],
  exports: [AddressService],
  imports: [AuthModule],
})
export class AddressModule {}
