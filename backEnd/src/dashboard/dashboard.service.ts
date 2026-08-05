import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      products,
      categories,
      customers,
      suppliers,

      sales,
      purchases,

      lowStock,
      recentSales,
      recentPurchases,
    ] = await Promise.all([
      this.prisma.product.count({ where: { deletedAt: null } }),

      this.prisma.category.count(),

      this.prisma.customer.count(),

      this.prisma.supplier.count(),

      this.prisma.sale.aggregate({
        _sum: {
          total: true,
        },
      }),

      this.prisma.purchase.aggregate({
        _sum: {
          total: true,
        },
      }),

      this.prisma.product.findMany({
        where: {
          deletedAt: null,
          quantity: {
            lte: 5,
          },
        },
        select: {
          id: true,
          name: true,
          quantity: true,
        },
        orderBy: {
          quantity: 'asc',
        },
        take: 5,
      }),

      this.prisma.sale.findMany({
        include: {
          customer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),

      this.prisma.purchase.findMany({
        include: {
          supplier: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),
    ]);

    return {
      products,
      categories,
      customers,
      suppliers,

      totalSales: Number(sales._sum.total ?? 0),

      totalPurchases: Number(purchases._sum.total ?? 0),

      lowStock,

      recentSales,

      recentPurchases,
    };
  }
}
