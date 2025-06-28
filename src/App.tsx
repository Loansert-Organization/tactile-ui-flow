
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
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
import { BasketProvider } from "@/contexts/BasketContext";
import { MyBasketsProvider } from "@/contexts/MyBasketsContext";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import ErrorBoundary from "@/components/ui/error-boundary";
import React, { Suspense, useEffect, useState } from "react";
import { HeaderSkeleton } from "@/components/ui/enhanced-skeleton";
import './i18n';

// Lazy load BasketWizard
const BasketWizard = React.lazy(() => import('@/pages/BasketWizard'));

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

  useEffect(() => {
    const networkInfo = getNetworkInfo();
    if (networkInfo) {
      console.log('[Network]', networkInfo);
    }

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
          {/* Splash and Welcome Routes */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/welcome" element={<WelcomeExperience />} />
          
          {/* Authentication Routes */}
          <Route path="/login-options" element={
            <Suspense fallback={<div>Loading...</div>}>
              {React.createElement(React.lazy(() => import('@/pages/LoginOptions')))}
            </Suspense>
          } />
          <Route path="/auth/email" element={
            <Suspense fallback={<div>Loading...</div>}>
              {React.createElement(React.lazy(() => import('@/pages/EmailLogin')))}
            </Suspense>
          } />
          <Route path="/auth/whatsapp" element={
            <Suspense fallback={<div>Loading...</div>}>
              {React.createElement(React.lazy(() => import('@/pages/WhatsAppLogin')))}
            </Suspense>
          } />
          <Route path="/auth/verify-otp" element={
            <Suspense fallback={<div>Loading...</div>}>
              {React.createElement(React.lazy(() => import('@/pages/OtpVerification')))}
            </Suspense>
          } />
          
          {/* Analysis routes for codebase review */}
          <Route path="/analysis" element={
            <Suspense fallback={<div>Loading Analysis...</div>}>
              {React.createElement(React.lazy(() => import('@/pages/Analysis')))}
            </Suspense>
          } />
          
          <Route path="/basket-audit" element={
            <Suspense fallback={<div>Loading Basket Audit...</div>}>
              {React.createElement(React.lazy(() => import('@/pages/BasketAudit')))}
            </Suspense>
          } />
          
          {/* Standalone routes */}
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/notifications" element={<NotificationsSettings />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Main app routes */}
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
