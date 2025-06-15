import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Feed } from "@/pages/Feed";
import { BasketOverview } from "@/pages/BasketOverview";
import { BasketDetailNonMember } from "@/pages/BasketDetailNonMember";
import { BasketParticipants } from "@/pages/BasketParticipants";
import { BasketSettings } from "@/pages/BasketSettings";
import { ContributionPage } from "@/pages/ContributionPage";
import { MyBaskets } from "@/pages/MyBaskets";
import CreateBasketWizard from "@/pages/CreateBasketWizard";
import NotFound from "./pages/NotFound";
import { BasketProvider } from "@/contexts/BasketContext";
import { MyBasketsProvider } from "@/contexts/MyBasketsContext";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import React, { Suspense, useEffect } from "react";
import { HeaderSkeleton } from "@/components/ui/enhanced-skeleton";
import HomeScreen from "@/pages/HomeScreen";
import PayScreen from "@/pages/PayScreen";
import QRPreviewScreen from "@/pages/QRPreviewScreen";
import HistoryScreen from "@/pages/HistoryScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
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
    // Log network conditions for debugging
    const networkInfo = getNetworkInfo();
    if (networkInfo) {
      console.log('[Network]', networkInfo);
    }

    // Preload critical pages
    measureTiming('preload-critical-pages', () => {
      import('@/pages/Feed');
      import('@/pages/MyBaskets');
    });
  }, [measureTiming, getNetworkInfo]);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* New Lifuti routes */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/pay" element={<PayScreen />} />
        <Route path="/qr-preview" element={<QRPreviewScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        {/* Standalone routes (no header/nav) */}
        <Route path="/create/*" element={<CreateBasketWizard />} />
        
        {/* Main app routes (with header and bottom nav) */}
        <Route path="/*" element={
          <>
            <Suspense fallback={<HeaderSkeleton />}>
              <AppHeader />
            </Suspense>
            <main className="flex-1 pt-2 pb-20">
              <Suspense fallback={
                <div className="flex justify-center items-center py-16">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Feed />} />
                  <Route path="/baskets/mine" element={<MyBaskets />} />
                  <Route path="/basket/:id" element={<BasketOverview />} />
                  <Route path="/basket/:id/join" element={<BasketDetailNonMember />} />
                  <Route path="/basket/:id/participants" element={<BasketParticipants />} />
                  <Route path="/basket/:id/settings" element={<BasketSettings />} />
                  <Route path="/basket/:id/contribute" element={<ContributionPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <BottomNav />
          </>
        } />
      </Routes>
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
        <BasketProvider>
          <MyBasketsProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </MyBasketsProvider>
        </BasketProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
