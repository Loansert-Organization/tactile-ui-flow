
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BasketProvider } from "@/contexts/BasketContext";
import { MyBasketsProvider } from "@/contexts/MyBasketsContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { PerformanceDashboard } from "@/components/dev/PerformanceDashboard";
import { useNativeFeatures } from "@/hooks/useNativeFeatures";

// Lazy load pages for better performance
const Index = lazy(() => import("@/pages/Index"));
const MyBaskets = lazy(() => import("@/pages/MyBaskets"));
const Feed = lazy(() => import("@/pages/Feed"));
const Chat = lazy(() => import("@/pages/Chat"));
const BasketDetailPage = lazy(() => import("@/pages/BasketDetailPage"));
const BasketDetailNonMember = lazy(() => import("@/pages/BasketDetailNonMember"));
const BasketOverview = lazy(() => import("@/pages/BasketOverview"));
const BasketParticipants = lazy(() => import("@/pages/BasketParticipants"));
const BasketSettings = lazy(() => import("@/pages/BasketSettings"));
const ContributionPage = lazy(() => import("@/pages/ContributionPage"));
const CreateBasketWizard = lazy(() => import("@/pages/CreateBasketWizard"));
const GettingStarted = lazy(() => import("@/pages/GettingStarted"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  const { initializeNativeFeatures } = useNativeFeatures();

  useEffect(() => {
    console.log('App initializing...');
    // Initialize native features
    initializeNativeFeatures();
  }, [initializeNativeFeatures]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BasketProvider>
          <MyBasketsProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
                <OfflineBanner />
                <AppHeader />
                
                <main className="pt-16 pb-20">
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                      <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/baskets" element={<MyBaskets />} />
                      <Route path="/baskets/mine" element={<MyBaskets />} />
                      <Route path="/feed" element={<Feed />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/basket/:id" element={<BasketDetailPage />} />
                      <Route path="/basket/:id/join" element={<BasketDetailNonMember />} />
                      <Route path="/basket/:id/overview" element={<BasketOverview />} />
                      <Route path="/basket/:id/participants" element={<BasketParticipants />} />
                      <Route path="/basket/:id/settings" element={<BasketSettings />} />
                      <Route path="/basket/:id/contribute" element={<ContributionPage />} />
                      <Route path="/create-basket" element={<CreateBasketWizard />} />
                      <Route path="/create/step/1" element={<CreateBasketWizard />} />
                      <Route path="/getting-started" element={<GettingStarted />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>

                <BottomNav />
                <PerformanceDashboard />
              </div>
              <Toaster />
            </BrowserRouter>
          </MyBasketsProvider>
        </BasketProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
