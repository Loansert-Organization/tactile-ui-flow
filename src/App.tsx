
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { GuestBanner } from "@/components/auth/GuestBanner";
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
import { Phone } from "@/pages/auth/Phone";
import { WhatsApp } from "@/pages/auth/WhatsApp";
import { Otp } from "@/pages/auth/Otp";
import { Profile } from "@/pages/profile";
import NotFound from "./pages/NotFound";
import { BasketProvider } from "@/contexts/BasketContext";
import { MyBasketsProvider } from "@/contexts/MyBasketsContext";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import ErrorBoundary from "@/components/ui/error-boundary";
import React, { Suspense, useEffect } from "react";
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

  useEffect(() => {
    const networkInfo = getNetworkInfo();
    if (networkInfo) {
      console.log('[Network]', networkInfo);
    }

    measureTiming('preload-critical-pages', () => {
      import('@/pages/Feed');
      import('@/pages/MyBaskets');
    });
  }, [measureTiming, getNetworkInfo]);

  return (
    <div className="min-h-screen flex flex-col">
      <ErrorBoundary>
        <Routes>
          {/* Authentication routes */}
          <Route path="/auth/phone" element={<Phone />} />
          <Route path="/auth/whatsapp" element={<WhatsApp />} />
          <Route path="/auth/otp" element={<Otp />} />
          
          {/* Redirect old routes to new ones */}
          <Route path="/whatsapp-login" element={<Navigate to="/auth/whatsapp" replace />} />
          <Route path="/whatsapp-otp" element={<Navigate to="/auth/otp" replace />} />
          
          {/* Standalone routes */}
          <Route path="/history" element={<HistoryScreen />} />
          
          {/* Main app routes */}
          <Route path="/*" element={
            <>
              <GuestBanner />
              <Suspense fallback={<HeaderSkeleton />}>
                <AppHeader />
              </Suspense>
              <main className="flex-1 pt-2 pb-20">
                <ErrorBoundary>
                  <Suspense fallback={
                    <div className="flex justify-center items-center py-16">
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
