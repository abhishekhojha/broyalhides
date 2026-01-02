import Footer from "@/components/Footer";
import MegaMenuNavbar from "@/components/MegaMenuNavbar"; // Update the path if necessary
import { StoreProvider } from "../StoreProvider";
import { Toaster } from "sonner";

export default function WebpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <Toaster position="bottom-center" richColors />
      <MegaMenuNavbar />
      {children}
      <Footer />
    </StoreProvider>
  );
}
