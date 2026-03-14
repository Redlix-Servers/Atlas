import { prisma } from '../lib/prisma';

export async function recordLog(developerId: string, action: string, details?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        developerId,
        action,
        details: details || null,
      }
    });
  } catch (error) {
    console.error('Failed to record audit log:', error);
  }
}
