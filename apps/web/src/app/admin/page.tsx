import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

interface AdminSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export default async function AdminPage() {
  const session = (await getServerSession(authOptions)) as AdminSession | null;

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  const [totalUsers, totalPlaces, adminCount] = await Promise.all([
    prisma.user.count(),
    prisma.place.count(),
    prisma.user.count({ where: { role: 'admin' } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { id: 'desc' },
  });

  const recentPlaces = await prisma.place.findMany({
    orderBy: { id: 'desc' },
  });

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

        {/* Статистик картууд */}
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

        {/* Сүүлийн хэрэглэгчид */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Сүүлийн хэрэглэгчид</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Цахим шуудан</th>
                      <th className="text-left py-2 px-2">Үүрэг</th>
                      <th className="text-left py-2 px-2">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">{user.email}</td>
                        <td className="py-2 px-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-gray-500 text-xs">
                          {String(user.id).slice(0, 25)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Хэрэглэгч байхгүй</p>
            )}
          </CardContent>
        </Card>

        {/* Сүүлийн газрууд */}
        <Card>
          <CardHeader>
            <CardTitle>Сүүлийн газрууд</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPlaces.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Газрын нэр</th>
                      <th className="text-left py-2 px-2">Ангилал</th>
                      <th className="text-left py-2 px-2">Байршил</th>
                      <th className="text-left py-2 px-2">Үүсгэгдсэн он</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPlaces.map((place) => (
                      <tr key={place.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium">{place.name}</td>
                        <td className="py-2 px-2">{place.category || '-'}</td>
                        <td className="py-2 px-2 text-gray-600">
                          {place.location || '-'}
                        </td>
                        <td className="py-2 px-2 text-gray-500">
                          {place.founded_year || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Газар байхгүй</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
