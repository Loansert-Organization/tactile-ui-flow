
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { Feed } from "@/pages/Feed";
import { Chat } from "@/pages/Chat";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
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
        {/* Standalone routes (no header/nav) */}
        <Route path="/create/*" element={<CreateBasketWizard />} />
        
        {/* Main app routes (with header only) */}
        <Route path="/*" element={
          <>
            <Suspense fallback={<HeaderSkeleton />}>
              <AppHeader />
            </Suspense>
            <main className="flex-1">
              <Suspense fallback={
                <div className="p-4">
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-gray-400">Loading...</p>
                  </div>
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
          </>
        } />
      </Routes>
      <PWAInstallPrompt />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
