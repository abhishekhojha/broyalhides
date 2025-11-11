import Footer from "@/components/Footer";
import Navbar from "@/components/MegaMenuNavbar"; // Update the path if necessary
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="">{children}</main>
      <Footer />
    </>
  );
}
