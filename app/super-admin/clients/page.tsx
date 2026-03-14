import { prisma } from '../../lib/prisma';
import ClientManager from './ClientManager';

export default async function ManageClientsPage() {
  const developers = await prisma.developer.findMany({
    where: { status: 'approved' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  const clients = await prisma.client.findMany({
    include: { developer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return <ClientManager developers={developers} clients={clients} />;
}
