import './global.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Шар Ном',
  description: 'Өөрт таалагдсан газруудыг олоорой',
  icons: {
    icon: '/sharnom.png',
  },

  openGraph: {
    title: 'Шар Ном',
    description: 'Өөрт таалагдсан газруудыг олоорой',
    url: 'https://sharnom.mn',
    siteName: 'Шар Ном',
    images: [
      {
        url: '/sharnom.png',
        width: 1200,
        height: 630,
        alt: 'Шар Ном',
      },
    ],
    locale: 'mn_MN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
