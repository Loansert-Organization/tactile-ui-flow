
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Feed } from "@/pages/Feed";
import { Chat } from "@/pages/Chat";
import { BasketOverview } from "@/pages/BasketOverview";
import { BasketParticipants } from "@/pages/BasketParticipants";
import { BasketSettings } from "@/pages/BasketSettings";
import { ContributionPage } from "@/pages/ContributionPage";
import { MyBaskets } from "@/pages/MyBaskets";
import CreateBasketWizard from "@/pages/CreateBasketWizard";
import Splash from "@/pages/Splash";
import Welcome from "@/pages/Welcome";
import InvitePage from "@/pages/InvitePage";
import Notifications from "@/pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Standalone routes (no header/nav) */}
            <Route path="/splash" element={<Splash />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/invite/:code" element={<InvitePage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/create/*" element={<CreateBasketWizard />} />
            
            {/* Main app routes (with header/nav) */}
            <Route path="/*" element={
              <>
                <AppHeader />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/baskets/mine" element={<MyBaskets />} />
                    <Route path="/basket/:id" element={<BasketOverview />} />
                    <Route path="/basket/:id/participants" element={<BasketParticipants />} />
                    <Route path="/basket/:id/settings" element={<BasketSettings />} />
                    <Route path="/basket/:id/contribute" element={<ContributionPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <BottomNav />
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
