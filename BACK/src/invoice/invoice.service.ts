import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.prisma.invoice.create({
      data: {
        ...createInvoiceDto,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(options?: Prisma.InvoiceFindManyArgs): Promise<Invoice[]> {
    return this.prisma.invoice.findMany(options);
  }

  async findOne(id: number): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateInvoiceDto): Promise<Invoice> {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    return await this.prisma.invoice.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Invoice> {
    return await this.prisma.invoice.delete({ where: { id } });
  }
}
