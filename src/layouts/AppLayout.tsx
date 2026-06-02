import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function AppLayout() {
  return (
    <main className="app-shell relative min-h-screen pt-[126px] lg:pt-20">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
