'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function superAdminLogin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (
    username === process.env.SUPERADMIN_USERNAME && 
    password === process.env.SUPERADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    cookieStore.set('super_admin_token', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return { success: true };
  } else {
    return { error: 'Invalid super admin credentials' };
  }
}
