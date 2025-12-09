import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return <div>Admin Dashboard</div>;
}
