'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { recordLog } from '../../lib/logging';

export async function createTask(formData: FormData) {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');
  if (!devToken || !devToken.value) return { error: 'Not authenticated' };

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = (formData.get('status') as string) || 'todo';

  if (!title) return { error: 'Title is required' };

  try {
    await prisma.task.create({
      data: {
        title,
        description,
        status,
        developerId: devToken.value,
      }
    });
    await recordLog(devToken.value, 'CREATE_TASK', `Created task: ${title}`);
    revalidatePath('/developer-portal/board');
    return { success: true };
  } catch (err: any) {
    return { error: 'Failed to create task.' };
  }
}

export async function moveTask(taskId: string, newStatus: string) {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');
  if (!devToken || !devToken.value) return { error: 'Not authenticated' };

  try {
    await prisma.task.update({
      where: { 
        id: taskId,
        developerId: devToken.value // extra security to ensure they own it
      },
      data: { status: newStatus }
    });
    await recordLog(devToken.value, 'MOVE_TASK', `Moved task ${taskId} to ${newStatus}`);
    revalidatePath('/developer-portal/board');
    return { success: true };
  } catch (err: any) {
    return { error: 'Failed to apply movement.' };
  }
}

export async function deleteTask(taskId: string) {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');
  if (!devToken || !devToken.value) return { error: 'Not authenticated' };

  try {
    await prisma.task.delete({
      where: { 
        id: taskId,
        developerId: devToken.value
      }
    });
    await recordLog(devToken.value, 'DELETE_TASK', `Deleted task: ${taskId}`);
    revalidatePath('/developer-portal/board');
    return { success: true };
  } catch (err: any) {
    return { error: 'Failed to delete task.' };
  }
}
