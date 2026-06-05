import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Globe2,
  HardHat,
  Home,
  LogOut,
  MessageSquareText,
  Truck,
  UserRound,
  X,
  Menu,
} from "lucide-react";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const avatar =
    user?.avatarUrl ||
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=160&auto=format&fit=crop";

  const notificationsQuery = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => resourcesService.notifications(user!.id),
    enabled: Boolean(user?.id),
    refetchInterval: 5000,
    staleTime: 5000,
  });
  const conversationsQuery = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: () => resourcesService.conversations(user!.id),
    enabled: Boolean(user?.id),
    refetchInterval: 5000,
    staleTime: 5000,
  });

  const unreadNotificationCount = (notificationsQuery.data ?? []).filter(
    (n) => !n.read
  ).length;
  const unreadMessageCount = (conversationsQuery.data ?? []).reduce(
    (total, c) => total + c.unreadCount,
    0
  );

  const navItems = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/equipment", label: t("equipment"), icon: Truck },
    { to: "/providers", label: t("providers"), icon: HardHat },
    { to: "/projects", label: t("projects"), icon: BriefcaseBusiness },
    {
      to: "/messages",
      label: t("messages"),
      icon: MessageSquareText,
      badge: unreadMessageCount,
    },
    {
      to: "/notifications",
      label: t("notifications"),
      icon: Bell,
      badge: unreadNotificationCount,
    },
    { to: "/profile", label: t("profile"), icon: UserRound },
  ];

  // Bottom-tab items (5 most important for one-thumb reach)
  const bottomTabItems = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/equipment", label: t("equipment"), icon: Truck },
    { to: "/providers", label: t("providers"), icon: HardHat },
    {
      to: "/messages",
      label: t("messages"),
      icon: MessageSquareText,
      badge: unreadMessageCount,
    },
    { to: "/profile", label: t("profile"), icon: UserRound },
  ];

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    function handler(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [drawerOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function handleLogout() {
    logout();
    setDrawerOpen(false);
    navigate("/login");
  }

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-neutral-200/80 bg-white/97 shadow-sm backdrop-blur-xl"
            : "border-b border-neutral-100 bg-white/90 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 w-full items-center justify-between gap-3 px-4 sm:max-w-screen-sm sm:px-5 md:max-w-screen-md lg:h-[72px] lg:max-w-screen-lg lg:px-8 xl:max-w-screen-xl 2xl:max-w-screen-2xl">

          {/* Logo */}
          <Link
            to="/"
            aria-label={t("home")}
            className="flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-amber-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm sm:h-10 sm:w-10">
              <HardHat className="size-5 text-white sm:size-6" />
            </div>
            <span className="truncate text-[17px] font-extrabold tracking-tight text-neutral-900 sm:text-lg">
              {t("appName")}
            </span>
          </Link>

          {/* ── Desktop nav (lg+) ──────────────────────────────── */}
          <nav
            aria-label="primary navigation"
            className="hidden items-center gap-0.5 lg:flex xl:gap-1"
          >
            {navItems.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150 xl:px-4 xl:text-[15px]",
                    isActive
                      ? "bg-amber-50 text-amber-700"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  )
                }
              >
                <Icon className="size-[17px]" />
                {label}
                {badge ? (
                  <motion.span
                    key={badge}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                  >
                    {badge}
                  </motion.span>
                ) : null}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop right-side actions (lg+) ──────────────── */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-2.5">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
            >
              <Globe2 className="size-4" />
              {t("language")}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  aria-label={t("profile")}
                  className="group flex items-center gap-2.5"
                >
                  <div className="relative size-9 overflow-hidden rounded-full ring-2 ring-amber-200 ring-offset-1 transition-all group-hover:ring-amber-400 xl:size-10">
                    <img
                      src={avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden flex-col items-start xl:flex">
                    <p className="text-sm font-bold leading-tight text-neutral-800">
                      {user?.firstName || user?.name || "المستخدم"}
                      {user?.lastName ? ` ${user.lastName}` : ""}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {user?.role || "عضو"}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="size-4" />
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-neutral-200 px-4 py-1.5 text-sm font-semibold text-neutral-700 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/register/type"
                  className="rounded-lg bg-gradient-to-b from-amber-500 to-amber-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-amber-600 hover:to-amber-700 hover:shadow-md"
                >
                  {t("register")}
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile right actions (< lg) ────────────────────── */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Language toggle — compact icon only */}
            <button
              onClick={toggleLanguage}
              aria-label="تغيير اللغة"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:bg-amber-50 hover:text-amber-700"
            >
              <Globe2 className="size-4" />
            </button>

            {/* Notification badge shortcut */}
            {isAuthenticated && unreadNotificationCount > 0 && (
              <Link
                to="/notifications"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
              >
                <Bell className="size-4" />
                <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="فتح القائمة"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 active:bg-neutral-200"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-neutral-900/40 backdrop-blur-[2px] lg:hidden"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[300px] flex-col bg-white shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="القائمة"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
                  aria-label="إغلاق القائمة"
                >
                  <X className="size-5" />
                </button>
                <Link
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                    <HardHat className="size-4 text-white" />
                  </div>
                  <span className="text-base font-extrabold text-neutral-900">
                    {t("appName")}
                  </span>
                </Link>
              </div>

              {/* User section (if authenticated) */}
              {isAuthenticated && (
                <div className="border-b border-neutral-100 px-5 py-4">
                  <Link
                    to="/profile"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="relative size-11 overflow-hidden rounded-full ring-2 ring-amber-200">
                      <img
                        src={avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-800">
                        {user?.firstName || user?.name || "المستخدم"}
                        {user?.lastName ? ` ${user.lastName}` : ""}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {user?.role || "عضو"}
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="app menu">
                <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                  التنقل
                </p>
                <ul className="space-y-0.5">
                  {navItems.map(({ to, label, icon: Icon, badge }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={to === "/"}
                        onClick={() => setDrawerOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all",
                            isActive
                              ? "bg-amber-50 text-amber-700"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                isActive
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-neutral-100 text-neutral-500"
                              )}
                            >
                              <Icon className="size-4" />
                            </span>
                            <span className="flex-1">{label}</span>
                            {badge ? (
                              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                {badge}
                              </span>
                            ) : null}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Drawer footer */}
              <div className="border-t border-neutral-100 px-4 py-4 space-y-2">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                      <LogOut className="size-4" />
                    </span>
                    {t("logout")}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-center rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      {t("login")}
                    </Link>
                    <Link
                      to="/register/type"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-center rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-amber-600 hover:to-amber-700"
                    >
                      {t("register")}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Tab Bar (fixed, always visible, < lg) ── */}
      <nav
        aria-label="bottom navigation"
        className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200/80 bg-white/97 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex h-[60px] max-w-[430px] items-center justify-around px-1 sm:max-w-screen-sm">
          {bottomTabItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative flex min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition-all duration-150",
                  isActive
                    ? "text-amber-600"
                    : "text-neutral-400 hover:text-neutral-700 active:scale-95"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150",
                      isActive ? "bg-amber-100" : ""
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px]",
                        isActive ? "text-amber-600" : "text-neutral-400"
                      )}
                    />
                  </span>
                  <span className="leading-none">{label}</span>
                  {badge ? (
                    <span className="absolute right-2 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
