import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

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

  findAll(query: QueryProductDto) {
  const {
    page,
    limit,
    search,
    categoryId,
    minPrice,
    maxPrice,
  } = query;

  return this.prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,

    where: {
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),

      ...(categoryId && {
        categoryId,
      }),

      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && {
                gte: minPrice,
              }),
              ...(maxPrice !== undefined && {
                lte: maxPrice,
              }),
            },
          }
        : {}),
    },

    include: {
      category: true,
    },

    orderBy: {
      id: 'asc',
    },
  });
}

  async findOne(id: number) {
  const product = await this.prisma.product.findUnique({
    where: { id },
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

  return this.prisma.product.update({
    where: { id },
    data: dto,
  });
}

  async remove(id: number) {
  await this.findOne(id);

  return this.prisma.product.delete({
    where: { id },
  });
}
}
