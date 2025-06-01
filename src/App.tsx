import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { LazyPage } from "@/components/ui/lazy-page";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { BasketProvider } from "@/contexts/BasketContext";
import { MyBasketsProvider } from "@/contexts/MyBasketsContext";
import { offlineStorage } from "@/lib/offline-storage";

// Lazy load pages for better performance
const Feed = lazy(() => import("@/pages/Feed").then(module => ({ default: module.Feed })));
const Chat = lazy(() => import("@/pages/Chat").then(module => ({ default: module.Chat })));
const BasketOverview = lazy(() => import("@/pages/BasketOverview").then(module => ({ default: module.BasketOverview })));
const BasketDetailNonMember = lazy(() => import("@/pages/BasketDetailNonMember").then(module => ({ default: module.BasketDetailNonMember })));
const BasketParticipants = lazy(() => import("@/pages/BasketParticipants").then(module => ({ default: module.BasketParticipants })));
const BasketSettings = lazy(() => import("@/pages/BasketSettings").then(module => ({ default: module.BasketSettings })));
const ContributionPage = lazy(() => import("@/pages/ContributionPage").then(module => ({ default: module.ContributionPage })));
const MyBaskets = lazy(() => import("@/pages/MyBaskets").then(module => ({ default: module.MyBaskets })));
const CreateBasketWizard = lazy(() => import("@/pages/CreateBasketWizard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init().catch(console.error);
    
    // Clean up stale data weekly
    offlineStorage.clearStaleData().catch(console.error);
    
    // Listen for service worker messages
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data?.type === 'SYNC_OFFLINE_DATA') {
        console.log('[App] Received sync request from service worker');
        // Trigger any necessary data refresh here
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineBanner />
        <BasketProvider>
          <MyBasketsProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                {/* Standalone routes (no header/nav) */}
                <Route path="/create/*" element={
                  <LazyPage>
                    <CreateBasketWizard />
                  </LazyPage>
                } />
                
                {/* Main app routes (with header only) */}
                <Route path="/*" element={
                  <>
                    <AppHeader />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={
                          <LazyPage>
                            <Feed />
                          </LazyPage>
                        } />
                        <Route path="/baskets/mine" element={
                          <LazyPage>
                            <MyBaskets />
                          </LazyPage>
                        } />
                        <Route path="/basket/:id" element={
                          <LazyPage>
                            <BasketOverview />
                          </LazyPage>
                        } />
                        <Route path="/basket/:id/join" element={
                          <LazyPage>
                            <BasketDetailNonMember />
                          </LazyPage>
                        } />
                        <Route path="/basket/:id/participants" element={
                          <LazyPage>
                            <BasketParticipants />
                          </LazyPage>
                        } />
                        <Route path="/basket/:id/settings" element={
                          <LazyPage>
                            <BasketSettings />
                          </LazyPage>
                        } />
                        <Route path="/basket/:id/contribute" element={
                          <LazyPage>
                            <ContributionPage />
                          </LazyPage>
                        } />
                        <Route path="*" element={
                          <LazyPage>
                            <NotFound />
                          </LazyPage>
                        } />
                      </Routes>
                    </main>
                  </>
                } />
              </div>
            </BrowserRouter>
          </MyBasketsProvider>
        </BasketProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
