import { useEffect, useState } from "react";
import { Bell, BriefcaseBusiness, Globe2, HardHat, Home, LogOut, Menu, MessageSquareText, Truck, UserRound, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from "@/context/AuthContext";
import { useI18n } from "@/i18n/I18nContext";
import { resourcesService } from "@/services/resources.service";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuthState();
  const { t, toggleLanguage } = useI18n();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const avatar = user?.avatarUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=160&auto=format&fit=crop";

  const notificationsQuery = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => resourcesService.notifications(user!.id),
    enabled: Boolean(user?.id),
    refetchInterval: 5000,
    staleTime: 5000
  });
  const conversationsQuery = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: () => resourcesService.conversations(user!.id),
    enabled: Boolean(user?.id),
    refetchInterval: 5000,
    staleTime: 5000
  });

  const unreadNotificationCount = (notificationsQuery.data ?? []).filter((notification) => !notification.read).length;
  const unreadMessageCount = (conversationsQuery.data ?? []).reduce((total, conversation) => total + conversation.unreadCount, 0);

  const navItems = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/equipment", label: t("equipment"), icon: Truck },
    { to: "/providers", label: t("providers"), icon: HardHat },
    { to: "/projects", label: t("projects"), icon: BriefcaseBusiness },
    { to: "/messages", label: t("messages"), icon: MessageSquareText, badge: unreadMessageCount },
    { to: "/notifications", label: t("notifications"), icon: Bell, badge: unreadNotificationCount },
    { to: "/profile", label: t("profile"), icon: UserRound }
  ];

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-neutral-200/80 bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            : "border-b border-transparent bg-white/80 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[430px] items-center justify-between gap-3 px-4 sm:max-w-screen-sm sm:px-5 md:max-w-screen-md lg:h-[72px] lg:max-w-screen-lg lg:px-8 xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          {/* Logo */}
          <Link
            to="/"
            aria-label={t("home")}
            className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-primary-50 sm:gap-2.5"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 sm:size-10">
              <HardHat className="size-5 text-white sm:size-6" />
            </div>
            <span className="truncate text-lg font-extrabold text-neutral-900 sm:text-xl">
              {t("appName")}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label={t("home")} className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {navItems.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 xl:px-4 xl:text-[15px]",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  )
                }
              >
                <Icon className="size-[18px]" />
                {label}
                {badge ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-error-500 px-1.5 text-[10px] font-bold text-white"
                  >
                    {badge}
                  </motion.span>
                ) : null}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 sm:text-sm"
            >
              <Globe2 className="size-4" />
              {t("language")}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/profile" aria-label={t("profile")} className="group flex items-center gap-2.5">
                  <div className="relative size-9 overflow-hidden rounded-full ring-2 ring-primary-200 ring-offset-1 transition-all group-hover:ring-primary-400 sm:size-10">
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="hidden flex-col items-start text-right lg:flex">
                    <p className="text-sm font-bold text-neutral-800">
                      {user?.firstName || user?.name || "المستخدم"}
                      {user?.lastName ? ` ${user.lastName}` : ""}
                    </p>
                    <p className="text-[11px] text-neutral-500">{user?.role || "عضو"}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 transition-all hover:border-error-300 hover:bg-error-50 hover:text-error-600 sm:text-sm"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">{t("logout")}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 sm:px-4 sm:text-sm"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/register/type"
                  className="rounded-lg bg-gradient-to-b from-primary-500 to-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-md sm:px-4 sm:text-sm"
                >
                  {t("register")}
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex size-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav - sliding menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-neutral-100 bg-white lg:hidden"
              aria-label={t("home")}
            >
              <div className="mx-auto grid max-w-[430px] grid-cols-4 gap-1 px-3 py-3 sm:max-w-screen-sm sm:grid-cols-5 sm:px-4 md:max-w-screen-md">
                {navItems.map(({ to, label, icon: Icon, badge }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[11px] font-semibold transition-all sm:text-xs",
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                      )
                    }
                  >
                    <Icon className="size-5" />
                    <span className="truncate">{label}</span>
                    {badge ? (
                      <span className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-error-500 px-1 text-[9px] font-bold text-white">
                        {badge}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
