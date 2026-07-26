import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async create(createStockDto: CreateStockDto) {
    return this.prisma.stock.create({
      data: {
        productId: createStockDto.productId,
        quantity: createStockDto.quantity,
        type: createStockDto.type,
      },
    });
  }

  async findAll() {
    return this.prisma.stock.findMany({
      include: {
        product: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.stock.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    return this.prisma.stock.update({
      where: { id },
      data: updateStockDto,
    });
  }

  async remove(id: number) {
    return this.prisma.stock.delete({
      where: { id },
    });
  }
}