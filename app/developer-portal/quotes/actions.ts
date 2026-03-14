'use server';

import { cookies } from 'next/headers';
import { recordLog } from '../../lib/logging';

export async function logQuoteGeneration(clientName: string, total: string) {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');

  if (devToken && devToken.value) {
    await recordLog(devToken.value, 'GENERATE_QUOTE', `Generated quote for ${clientName} - Amount: ${total}`);
  }
}
