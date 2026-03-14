'use server';

import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  // Simulate network latency for saving settings
  await new Promise(resolve => setTimeout(resolve, 800));

  // Extract dummy values
  const maintenanceMode = formData.get('maintenance_mode') === 'on';
  const autoApprove = formData.get('auto_approve_devs') === 'on';
  const systemName = formData.get('system_name');

  // Typically you would save these to Prisma here
  // await prisma.settings.update({ ... })

  // Force cache invalidation to reset the dashboard state
  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');

  return { success: true };
}
