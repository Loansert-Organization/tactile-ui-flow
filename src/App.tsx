
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
import { MyBaskets } from "@/pages/MyBaskets";
import { InviteLanding } from "@/pages/InviteLanding";
import { GettingStarted } from "@/pages/GettingStarted";
import { SplashScreen } from "@/pages/SplashScreen";
import { CodeAssignment } from "@/pages/CodeAssignment";
import { JoinByCode } from "@/pages/JoinByCode";
import CreateBasketWizard from "@/pages/CreateBasketWizard";
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
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/welcome" element={<CodeAssignment />} />
            <Route path="/join" element={<JoinByCode />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/invite/:code" element={<InviteLanding />} />
            <Route path="/create/*" element={<CreateBasketWizard />} />
            <Route path="/*" element={
              <>
                <AppHeader />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/baskets/mine" element={<MyBaskets />} />
                    <Route path="/basket/:id" element={<BasketOverview />} />
                    <Route path="/basket/:id/chat" element={<Chat />} />
                    <Route path="/basket/:id/participants" element={<BasketParticipants />} />
                    <Route path="/basket/:id/settings" element={<BasketSettings />} />
                    <Route path="/notifications" element={<div className="p-4 pb-24"><h1>Notifications - Coming Soon</h1></div>} />
                    <Route path="/profile" element={<div className="p-4 pb-24"><h1>Profile - Coming Soon</h1></div>} />
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
