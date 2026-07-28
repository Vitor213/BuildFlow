import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateProductDto, imageUrl?: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: Number(dto.categoryId),
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const product = await this.prisma.product.create({
      data: {
        ...dto,
        imageUrl,
      },
      include: {
        category: true,
      },
    });

    await this.auditService.log({
      action: 'CREATE',
      entity: 'Product',
      entityId: product.id,
      description: `Produto ${product.name} criado`,
    });

    return product;
  }

  findAll(query: QueryProductDto) {
    const { page, limit, search, categoryId, minPrice, maxPrice } = query;

    return this.prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,

      where: {
        deletedAt: null,

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
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
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

    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
    });

    await this.auditService.log({
      action: 'UPDATE',
      entity: 'Product',
      entityId: product.id,
      description: `Produto ${product.name} atualizado`,
    });

    return product;
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    await this.auditService.log({
      action: 'DELETE',
      entity: 'Product',
      entityId: product.id,
      description: `Produto ${product.name} removido`,
    });

    return product;
  }

  async restore(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const restored = await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });

    await this.auditService.log({
      action: 'RESTORE',
      entity: 'Product',
      entityId: restored.id,
      description: `Produto ${restored.name} restaurado`,
    });

    return restored;
  }
}
