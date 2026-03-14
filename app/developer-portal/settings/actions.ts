'use server';

import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { recordLog } from '../../lib/logging';

export async function updateDeveloperSettings(formData: FormData) {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');

  if (!devToken || !devToken.value) {
    return { error: 'Not authenticated' };
  }

  const name = formData.get('name') as string;
  const reason = formData.get('reason') as string;

  if (!name) return { error: 'Name is required' };

  try {
    await prisma.developer.update({
      where: { id: devToken.value },
      data: {
        name,
        reason: reason || undefined,
      }
    });

    await recordLog(devToken.value, 'UPDATE_SETTINGS', `Updated profile name/reason`);

    revalidatePath('/developer-portal/settings');
    revalidatePath('/developer-portal'); // also refresh the sidebar if name changed
    
    return { success: true };
  } catch (error: any) {
    return { error: 'Failed to update settings.' };
  }
}
