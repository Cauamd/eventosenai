import './globals.css';

export const metadata = { title: 'EventoSENAI', description: 'Agenda de eventos escolares' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
