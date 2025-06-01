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
import { usePushNotifications, useStatusBar, useSplashScreen } from "@/hooks/useNativeFeatures";
import { Capacitor } from "@capacitor/core";

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
  const { initializePush } = usePushNotifications();
  const { setDark } = useStatusBar();
  const { hideSplash } = useSplashScreen();

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init().catch(console.error);
    
    // Clean up stale data weekly
    offlineStorage.clearStaleData().catch(console.error);
    
    // Initialize native features if on mobile
    if (Capacitor.isNativePlatform()) {
      console.log('[App] Running on native platform');
      
      // Set status bar style
      setDark().catch(console.error);
      
      // Hide splash screen after app loads
      setTimeout(() => {
        hideSplash().catch(console.error);
      }, 1000);
      
      // Initialize push notifications
      initializePush().catch(console.error);
    }
    
    // Listen for service worker messages
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data?.type === 'SYNC_OFFLINE_DATA') {
        console.log('[App] Received sync request from service worker');
        // Trigger any necessary data refresh here
      }
    });
  }, [initializePush, setDark, hideSplash]);

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
                <Routes>
                  {/* Standalone routes (no header/nav) */}
                  <Route path="/create/*" element={
                    <LazyPage>
                      <CreateBasketWizard />
                    </LazyPage>
                  } />
                  
                  {/* Main app routes (with header only) */}
                  <Route path="/" element={
                    <>
                      <AppHeader />
                      <main className="flex-1">
                        <LazyPage>
                          <Feed />
                        </LazyPage>
                      </main>
                    </>
                  } />
                  <Route path="/baskets/mine" element={
                    <>
                      <AppHeader />
                      <main className="flex-1">
                        <LazyPage>
                          <MyBaskets />
                        </LazyPage>
                      </main>
                    </>
                  } />
                  <Route path="/basket/:id" element={
                    <>
                      <AppHeader />
                      <main className="flex-1">
                        <LazyPage>
                          <BasketOverview />
                        </LazyPage>
                      </main>
                    </>
                  } />
                  <Route path="/basket/:id/join" element={
                    <>
                      <AppHeader />
                      <main className="flex-1">
                        <LazyPage>
                          <BasketDetailNonMember />
                        </LazyPage>
                      </main>
                    </>
                  } />
                  <Route path="/basket/:id/participants" element={
                    <>
                      <AppHeader />
                      <main className="flex-1">
                        <LazyPage>
                          <BasketParticipants />
                        </LazyPage>
                      </main>
                    </>
                  } />
                  <Route path="/basket/:id/settings" element={
                    <>
                      <AppHeader />
                      <main className="flex-1">
                        <LazyPage>
                          <BasketSettings />
                        </LazyPage>
                      </main>
                    </>
                  } />
                  <Route path="/basket/:id/contribute" element={
                    <>
                      <AppHeader />
                      <main className="flex-1">
                        <LazyPage>
                          <ContributionPage />
                        </LazyPage>
                      </main>
                    </>
                  } />
                  <Route path="*" element={
                    <>
                      <AppHeader />
                      <main className="flex-1">
                        <LazyPage>
                          <NotFound />
                        </LazyPage>
                      </main>
                    </>
                  } />
                </Routes>
              </div>
            </BrowserRouter>
          </MyBasketsProvider>
        </BasketProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
