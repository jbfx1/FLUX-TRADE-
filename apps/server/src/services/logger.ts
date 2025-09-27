import { prisma } from '../db/client';

export function audit(category: string, message: string, context?: Record<string, unknown>) {
  return prisma.auditLog.create({
    data: {
      category,
      message,
      context: context ?? null
    }
  });
}
