'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function createClient(formData: FormData) {
  const cookieStore = await cookies();
  const superToken = cookieStore.get('super_admin_token');

  if (!superToken || superToken.value !== 'true') return { error: 'Not authenticated' };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const company = formData.get('company') as string;
  const developerId = formData.get('developerId') as string;

  if (!name || !email) return { error: 'Name and email are required' };

  // Generate unique RED-XXXX ID
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const clientRef = `RED-${randomId}`;

  try {
    await prisma.client.create({
      data: {
        clientRef,
        name,
        email,
        company,
        developerId: developerId || null,
      }
    });
    revalidatePath('/super-admin/clients');
    return { success: true };
  } catch (err: any) {
    return { error: 'Failed to create client.' };
  }
}

export async function deleteClient(clientId: string) {
  const cookieStore = await cookies();
  const superToken = cookieStore.get('super_admin_token');

  if (!superToken || superToken.value !== 'true') return { error: 'Not authenticated' };

  try {
    await prisma.client.delete({
      where: { id: clientId }
    });
    revalidatePath('/super-admin/clients');
    return { success: true };
  } catch (err: any) {
    return { error: 'Failed to delete client.' };
  }
}
