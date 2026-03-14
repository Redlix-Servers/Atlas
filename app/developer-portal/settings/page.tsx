import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '../../lib/prisma';
import SettingsForm from './SettingsForm';

export default async function DeveloperSettingsPage() {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');

  if (!devToken || !devToken.value) {
    redirect('/dev-login');
  }

  const dev = await prisma.developer.findUnique({
    where: { id: devToken.value },
    select: {
      name: true,
      email: true,
      reason: true,
      createdAt: true
    }
  });

  if (!dev) {
    redirect('/dev-login');
  }

  return (
    <SettingsForm developer={dev} />
  );
}
