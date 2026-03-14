import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import QuoteGenerator from './QuoteGeneratorClient';

export default async function QuoteGeneratorPage() {
  const cookieStore = await cookies();
  const devToken = cookieStore.get('dev_token');

  if (!devToken || !devToken.value) {
    redirect('/dev-login');
  }

  return <QuoteGenerator />;
}
