import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'La Llave del Akelarre — Invitación Privada',
  description: 'Has recibido una llave secreta. No todos pueden abrir esta puerta.',
  openGraph: {
    title: 'La Llave del Akelarre — Invitación Privada',
    description: 'Experiencia secreta de acceso al Akelarre de Brujas.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#070509',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-akelarre-dark text-white antialiased selection:bg-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}
