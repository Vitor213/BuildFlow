import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(data: {
    userId?: number;
    action: string;
    entity: string;
    entityId: number;
    description?: string;
  }) {
    return this.prisma.auditLog.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.auditLog.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
