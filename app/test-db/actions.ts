'use server'

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitTestMessage(formData: FormData) {
  const text = formData.get('message') as string;
  if (!text) {
    return { error: 'Message cannot be empty' };
  }

  try {
    const res = await prisma.testMessage.create({
      data: { text },
    });
    revalidatePath('/test-db');
    return { success: true, data: res };
  } catch (error: any) {
    console.error('Database Error:', error);
    return { error: error.message || 'Failed to save to database' };
  }
}
