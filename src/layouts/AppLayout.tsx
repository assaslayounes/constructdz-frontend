import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function AppLayout() {
  return (
    <main className="app-shell relative min-h-screen pb-[60px] pt-16 lg:pb-0 lg:pt-[72px]">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
