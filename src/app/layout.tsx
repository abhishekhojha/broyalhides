import Navbar from '@/components/MegaMenuNavbar'; // Update the path if necessary
// @ts-ignore
import './globals.css';
import localFont from 'next/font/local';
const myFont = localFont({
  src: './mollie-glaston/MollieGlaston.otf', // Path to your font file
  display: 'swap',
  variable: '--font-my-font', // Optional: for use with CSS variables
});
export const metadata = {
  title: 'Artisan Hide - Premium Leather Goods',
  description: 'Handcrafted leather shoes and jackets.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className=""> {/* Set a base background color */}
        <Navbar />
        <main className=""> 
          {children}
        </main>
      </body>
    </html>
  );
}