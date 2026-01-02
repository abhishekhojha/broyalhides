import { StoreProvider } from "@/app/StoreProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreProvider>{children}</StoreProvider>;
}
