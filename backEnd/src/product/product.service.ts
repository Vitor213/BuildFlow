import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: dto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return await this.prisma.product.create({
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
