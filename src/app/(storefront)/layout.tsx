import { NavbarWrapper } from "@/components/layout/NavbarWrapper";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper />
      {children}
    </>
  );
}
