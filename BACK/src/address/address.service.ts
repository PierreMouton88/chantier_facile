import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    return this.prisma.address.create({
      data: {
        ...createAddressDto,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(options?: Prisma.AddressFindManyArgs): Promise<Address[]> {
    return this.prisma.address.findMany(options);
  }

  async findOne(id: number): Promise<Address> {
    return this.prisma.address.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, data: UpdateAddressDto): Promise<Address> {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    return await this.prisma.address.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Address> {
    return await this.prisma.address.delete({ where: { id } });
  }
}
