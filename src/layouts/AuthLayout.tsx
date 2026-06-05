import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function AuthLayout() {
  const location = useLocation();
  const isStandaloneRegisterStep = location.pathname === "/register/personal";

  return (
    <main className={`mobile-shell min-h-screen overflow-x-hidden ${isStandaloneRegisterStep ? "" : "pb-16 pt-16 lg:pt-[72px]"}`}>
      {!isStandaloneRegisterStep && <Navbar />}
      <Outlet />
      {!isStandaloneRegisterStep && <Footer />}
    </main>
  );
}
