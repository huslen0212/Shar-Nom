import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }
  // Fetch statistics
  const [totalUsers, totalPlaces, adminCount] = await Promise.all([
    prisma.user.count(),
    prisma.place.count(),
    prisma.user.count({ where: { role: 'admin' } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Систем удирдлагын хэсэг</p>
          </div>

          <div>
            <SignOutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Нийт хэрэглэгчид
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {adminCount} админ хэрэглэгч
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Нийт газрууд
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPlaces}</div>
              <p className="text-xs text-gray-500 mt-1">
                Шар номд байгаа газрууд
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Админ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{adminCount}</div>
              <p className="text-xs text-gray-500 mt-1">
                Системийн администраторууд
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
