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
import { HelpDialog } from "@/components/common/HelpDialog";

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
            ? "border-b border-amber-100/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:border-neutral-200/80 lg:bg-white/[0.97] lg:shadow-sm"
            : "border-b border-white/70 bg-white/85 shadow-[0_6px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:border-neutral-100 lg:bg-white/90 lg:shadow-none lg:backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-[76px] w-full items-center justify-between gap-3 px-4 sm:h-[76px] sm:max-w-screen-sm sm:px-5 md:max-w-screen-md lg:h-[72px] lg:max-w-screen-lg lg:px-8 xl:max-w-screen-xl 2xl:max-w-screen-2xl">
          {/* Logo */}
          <Link
            to="/"
            aria-label={t("home")}
            className="flex min-w-0 items-center gap-2 rounded-2xl px-2 py-1.5 transition-colors hover:bg-amber-50 active:scale-[0.98] sm:gap-2.5 sm:rounded-xl sm:px-1 sm:py-1 lg:active:scale-100"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_8px_20px_rgba(245,158,11,0.28)] sm:h-12 sm:w-12 lg:h-10 lg:w-10 lg:rounded-xl lg:shadow-sm">
              <HardHat className="size-6 text-white lg:size-6" />
            </div>
            <span className="truncate text-[22px] font-black tracking-tight text-neutral-950 sm:text-[22px] lg:text-lg lg:font-extrabold">
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
            <HelpDialog variant="navbar" />
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
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <HelpDialog variant="navbar-mobile" />
            <button
              onClick={toggleLanguage}
              aria-label="تغيير اللغة"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-700 shadow-sm transition-all hover:bg-amber-50 hover:text-amber-700 active:scale-95 sm:h-12 sm:w-12 lg:h-10 lg:w-10 lg:rounded-xl"
            >
              <Globe2 className="size-5" />
            </button>

            {isAuthenticated && unreadNotificationCount > 0 && (
              <Link
                to="/notifications"
                aria-label={t("notifications")}
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 sm:h-12 sm:w-12 lg:h-10 lg:w-10 lg:rounded-xl"
              >
                <Bell className="size-5" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-black text-white shadow-sm">
                  {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                </span>
              </Link>
            )}

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="فتح القائمة"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition-all hover:bg-neutral-800 active:scale-95 sm:h-12 sm:w-12 lg:h-10 lg:w-10 lg:rounded-xl"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-neutral-950/45 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            <motion.div
              key="drawer"
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,340px)] flex-col overflow-hidden rounded-l-[2rem] bg-white shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="القائمة"
            >
              <div className="bg-gradient-to-br from-amber-50 via-white to-white px-5 pb-4 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 active:scale-95"
                    aria-label="إغلاق القائمة"
                  >
                    <X className="size-5" />
                  </button>
                  <Link
                    to="/"
                    onClick={() => setDrawerOpen(false)}
                    className="flex min-w-0 items-center gap-2 rounded-2xl px-1 py-1 active:scale-[0.98]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_8px_20px_rgba(245,158,11,0.25)]">
                      <HardHat className="size-5 text-white" />
                    </div>
                    <span className="truncate text-lg font-black text-neutral-950">
                      {t("appName")}
                    </span>
                  </Link>
                </div>

                {isAuthenticated && (
                  <Link
                    to="/profile"
                    onClick={() => setDrawerOpen(false)}
                    className="mt-5 flex items-center gap-3 rounded-3xl border border-amber-100 bg-white/80 p-3 shadow-sm backdrop-blur-sm active:scale-[0.99]"
                  >
                    <div className="relative size-12 overflow-hidden rounded-2xl ring-2 ring-amber-200 ring-offset-2 ring-offset-white">
                      <img
                        src={avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-neutral-900">
                        {user?.firstName || user?.name || "المستخدم"}
                        {user?.lastName ? ` ${user.lastName}` : ""}
                      </p>
                      <p className="mt-0.5 truncate text-xs font-medium text-neutral-500">
                        {user?.role || "عضو"}
                      </p>
                    </div>
                  </Link>
                )}
              </div>

              <nav
                className="flex-1 overflow-y-auto px-4 py-4"
                aria-label="app menu"
              >
                <p className="mb-3 px-2 text-[11px] font-black uppercase tracking-widest text-neutral-400">
                  التنقل
                </p>
                <ul className="space-y-1.5">
                  {navItems.map(({ to, label, icon: Icon, badge }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={to === "/"}
                        onClick={() => setDrawerOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all active:scale-[0.99]",
                            isActive
                              ? "bg-amber-50 text-amber-700 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.16)]"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition-all",
                                isActive
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-neutral-100 text-neutral-500"
                              )}
                            >
                              <Icon className="size-[18px]" />
                            </span>
                            <span className="min-w-0 flex-1 truncate">{label}</span>
                            {badge ? (
                              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-black text-white shadow-sm">
                                {badge > 9 ? "9+" : badge}
                              </span>
                            ) : null}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-neutral-100 bg-neutral-50/70 px-4 py-4">
                <div className="mb-3">
                  <HelpDialog variant="drawer" />
                </div>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-red-100 bg-white px-3 py-3 text-sm font-bold text-red-600 shadow-sm transition-all hover:bg-red-50 active:scale-[0.99]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50">
                      <LogOut className="size-4" />
                    </span>
                    {t("logout")}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                      className="flex min-h-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm font-bold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.99]"
                    >
                      {t("login")}
                    </Link>
                    <Link
                      to="/register/type"
                      onClick={() => setDrawerOpen(false)}
                      className="flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 px-3 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(245,158,11,0.25)] transition-all hover:from-amber-600 hover:to-amber-700 active:scale-[0.99]"
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
        className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-neutral-100/80 bg-white/95 px-2 pb-2 pt-3 shadow-[0_-12px_34px_rgba(15,23,42,0.1)] backdrop-blur-2xl lg:hidden"
      >
        <div className="mx-auto flex h-[78px] max-w-[430px] items-center justify-between rounded-[1.75rem] border border-neutral-100 bg-white px-1.5 shadow-sm sm:h-[78px] sm:max-w-screen-sm sm:rounded-3xl sm:px-2">
          {bottomTabItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative flex min-w-[62px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[13px] font-black transition-all duration-300 sm:min-w-[56px] sm:text-[13px] sm:font-bold",
                  isActive
                    ? "bg-amber-50 text-amber-700"
                    : "text-neutral-400 hover:text-neutral-700 active:scale-95"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 sm:h-10 sm:w-10",
                      isActive
                        ? "bg-amber-100 text-amber-700 shadow-inner"
                        : "text-neutral-400"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[26px] transition-transform duration-300 sm:size-[26px]",
                        isActive ? "scale-110 text-amber-700" : "text-neutral-400"
                      )}
                      strokeWidth={isActive ? 2.6 : 2.1}
                    />
                  </span>
                  <span className="max-w-[68px] truncate leading-none tracking-wide">
                    {label}
                  </span>
                  {badge ? (
                    <span className="absolute right-2 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-black text-white shadow-sm">
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
