import './global.css';

export const metadata = {
  title: 'Шар Ном',
  description: 'Өөрт таалагдсан газруудыг олоорой',
  icons: {
    icon: '/sharnom.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
