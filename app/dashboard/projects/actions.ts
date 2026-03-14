'use server'

import { prisma } from '../../lib/prisma';

export async function createProjectAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const projectRef = formData.get('projectRef') as string;
    const projectUrl = formData.get('projectUrl') as string;
    const serviceRoleKey = formData.get('serviceRoleKey') as string;
    const databaseUrl = formData.get('databaseUrl') as string;
    const environment = (formData.get('environment') as string) || 'production';

    if (!name || !projectRef || !projectUrl || !serviceRoleKey || !databaseUrl) {
      return { error: 'All primary fields are required.' };
    }

    await prisma.project.create({
      data: {
        name,
        projectRef,
        projectUrl,
        serviceRoleKey,
        databaseUrl,
        environment
      }
    });

    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'A project with this reference already exists.' };
    }
    return { error: error.message || 'Failed to create project.' };
  }
}
