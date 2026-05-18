import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  console.log(process.env);
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      Hello {session.user?.name}
    </div>
  );
}