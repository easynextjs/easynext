import { Metadata } from "next";

export const metadata: Metadata = {
  title: "프리미엄",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
