import '@/styles/tailwind.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='fr' className={`h-full bg-gray-50 antialiased font-sans`}>
      <body className='flex h-full flex-col font-app font-medium'>
        <div className='flex min-h-full flex-col'>{children}</div>
      </body>
    </html>
  );
}
