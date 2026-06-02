import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MarketplacePage } from "@/pages/marketplace/MarketplacePage";
import { ContractsPage, NotificationsPage, PaymentsPage, ProjectExecutionPage, QuotesPage, ReviewsPage } from "@/pages/workflows/WorkflowPages";
import { ContractDetailPage } from "@/pages/workflows/ContractDetailPage";
import { ConversationPage } from "@/pages/messages/ConversationPage";
import { MessagesPage } from "@/pages/messages/MessagesPage";
import { RegisterTypePage } from "@/pages/register/RegisterTypePage";
import { RegisterPersonalInfoPage } from "@/pages/register/RegisterPersonalInfoPage";
import { RegisterAccountPage } from "@/pages/register/RegisterAccountPage";
import { RegisterOtpPage } from "@/pages/register/RegisterOtpPage";
import { RegisterSuccessPage } from "@/pages/register/RegisterSuccessPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { AddSkillsPage } from "@/pages/profile/AddSkillsPage";
import { AddEquipmentPage } from "@/pages/profile/AddEquipmentPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/equipment", element: <MarketplacePage kind="equipment" /> },
          { path: "/providers", element: <MarketplacePage kind="providers" /> },
          { path: "/projects", element: <MarketplacePage kind="projects" /> },
          { path: "/search", element: <MarketplacePage kind="equipment" /> },
          { path: "/messages", element: <MessagesPage /> },
          { path: "/messages/:conversationId", element: <ConversationPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/quotes", element: <QuotesPage /> },
          { path: "/contracts", element: <ContractsPage /> },
          { path: "/contracts/:contractId", element: <ContractDetailPage /> },
          { path: "/payments", element: <PaymentsPage /> },
          { path: "/reviews", element: <ReviewsPage /> },
          { path: "/execution", element: <ProjectExecutionPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/profile/skills", element: <AddSkillsPage /> },
          { path: "/profile/equipment/new", element: <AddEquipmentPage /> }
        ]
      }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterTypePage /> },
      { path: "/register/type", element: <RegisterTypePage /> },
      { path: "/register/personal", element: <RegisterPersonalInfoPage /> },
      { path: "/register/account", element: <RegisterAccountPage /> },
      { path: "/register/otp", element: <RegisterOtpPage /> },
      { path: "/register/success", element: <RegisterSuccessPage /> }
    ]
  },
  {
    path: "*",
    element: <PlaceholderPage title="الصفحة غير موجودة" />
  }
]);
