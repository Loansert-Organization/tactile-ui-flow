import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminGuard } from "@/guards/AdminGuard";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Feed } from "@/pages/Feed";
import { BasketOverview } from "@/pages/BasketOverview";
import { BasketDetailNonMember } from "@/pages/BasketDetailNonMember";
import { BasketParticipants } from "@/pages/BasketParticipants";
import { BasketSettings } from "@/pages/BasketSettings";
import { ContributionPage } from "@/pages/ContributionPage";
import { MyBaskets } from "@/pages/MyBaskets";
import { HistoryScreen } from "@/pages/HistoryScreen";
import Profile from "@/pages/profile";
import { NotificationsSettings } from "@/pages/NotificationsSettings";
import { TermsAndConditions } from "@/pages/TermsAndConditions";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import SplashScreen from "@/pages/Splash";
import WelcomeExperience from "@/pages/Welcome";
import LoginOptions from "@/pages/LoginOptions";
import EmailLogin from "@/pages/EmailLogin";
import WhatsAppLogin from "@/pages/WhatsAppLogin";
import OtpVerification from "@/pages/OtpVerification";
import { BasketProvider } from "@/contexts/BasketContext";
import { MyBasketsProvider } from "@/contexts/MyBasketsContext";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import ErrorBoundary from "@/components/ui/error-boundary";
import React, { Suspense, useEffect, useState } from "react";
import { HeaderSkeleton } from "@/components/ui/enhanced-skeleton";
import './i18n';

// Lazy load components
const BasketWizard = React.lazy(() => import('@/pages/BasketWizard'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/Dashboard'));
const AdminBaskets = React.lazy(() => import('@/pages/admin/Baskets'));
const AdminContributions = React.lazy(() => import('@/pages/admin/Contributions'));
const AdminUsers = React.lazy(() => import('@/pages/admin/Users'));
const AdminWallets = React.lazy(() => import('@/pages/admin/Wallets'));
const AdminCountries = React.lazy(() => import('@/pages/admin/Countries'));
const EasyMomoWrapper = React.lazy(() => import('@/components/EasyMomoWrapper'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const AppContent = () => {
  const { measureTiming, getNetworkInfo } = usePerformanceMonitor();
  const [showSplash, setShowSplash] = useState(true);
  const [networkInfo, setNetworkInfo] = useState({ online: false, type: 'offline' });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkInfo({ online: true, type: 'online' });
      if (import.meta.env.DEV) console.log('[Network]', networkInfo);
    };

    measureTiming('preload-critical-pages', () => {
      import('@/pages/Feed');
      import('@/pages/MyBaskets');
    });

    // Hide splash screen after initial load
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [measureTiming, getNetworkInfo]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ErrorBoundary>
        <Routes>
          {/* Splash and Welcome Routes - No headers/nav */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/welcome" element={<WelcomeExperience />} />
          <Route path="/login-options" element={<LoginOptions />} />
          <Route path="/auth/email" element={<EmailLogin />} />
          <Route path="/auth/whatsapp" element={<WhatsAppLogin />} />
          <Route path="/auth/verify-otp" element={<OtpVerification />} />
          
          {/* Analysis routes for codebase review - No headers/nav */}
          {import.meta.env.DEV && (
            <Route path="/analysis" element={
              <Suspense fallback={<div>Loading Analysis...</div>}>
                {React.createElement(React.lazy(() => import('@/pages/Analysis')))}
              </Suspense>
            } />
          )}
          {import.meta.env.DEV && (
            <Route path="/basket-audit" element={
              <Suspense fallback={<div>Loading Basket Audit...</div>}>
                {React.createElement(React.lazy(() => import('@/pages/BasketAudit')))}
              </Suspense>
            } />
          )}
          
          {/* Easy-Momo Feature - Standalone with no headers/nav for immersive experience */}
          <Route path="/easy-momo/*" element={
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">Loading Easy Momo...</p>
                  <p className="text-sm opacity-75">Mobile Money Made Simple</p>
                </div>
              </div>
            }>
              <EasyMomoWrapper />
            </Suspense>
          } />
          
          {/* Standalone routes - No headers/nav */}
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/notifications" element={<NotificationsSettings />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Admin routes - Protected by AdminGuard */}
          <Route path="/admin/*" element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }>
            <Route index element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="baskets" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminBaskets />
              </Suspense>
            } />
            <Route path="contributions" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminContributions />
              </Suspense>
            } />
            <Route path="users" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminUsers />
              </Suspense>
            } />
            <Route path="wallets" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminWallets />
              </Suspense>
            } />
            <Route path="countries" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminCountries />
              </Suspense>
            } />
          </Route>
          
          {/* Main app routes - With headers/nav */}
          <Route path="/*" element={
            <>
              <Suspense fallback={<HeaderSkeleton />}>
                <AppHeader />
              </Suspense>
              <main id="main-content" className="flex-1 pt-2 pb-20" role="main">
                <ErrorBoundary>
                  <Suspense fallback={
                    <div className="flex justify-center items-center py-16" role="status" aria-label="Loading">
                      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Feed />} />
                      <Route path="/baskets/mine" element={<MyBaskets />} />
                      <Route path="/baskets/new" element={
                        <Suspense fallback={<div>Loading...</div>}>
                          <BasketWizard />
                        </Suspense>
                      } />
                      <Route path="/basket/:id" element={<BasketOverview />} />
                      <Route path="/basket/:id/join" element={<BasketDetailNonMember />} />
                      <Route path="/basket/:id/participants" element={<BasketParticipants />} />
                      <Route path="/basket/:id/settings" element={<BasketSettings />} />
                      <Route path="/basket/:id/contribute" element={<ContributionPage />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </main>
              <BottomNav />
            </>
          } />
        </Routes>
      </ErrorBoundary>
      <PWAInstallPrompt />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BasketProvider>
            <MyBasketsProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </MyBasketsProvider>
          </BasketProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
