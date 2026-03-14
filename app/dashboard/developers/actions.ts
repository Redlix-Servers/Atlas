'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function approveDeveloper(id: string) {
  try {
    await prisma.developer.update({
      where: { id },
      data: { status: 'approved' },
    });
    revalidatePath('/dashboard/developers');
  } catch (err) {
    console.error('Failed to approve developer:', err);
  }
}

export async function rejectDeveloper(id: string) {
  try {
    await prisma.developer.update({
      where: { id },
      data: { status: 'rejected' },
    });
    revalidatePath('/dashboard/developers');
  } catch (err) {
    console.error('Failed to reject developer:', err);
  }
}
