
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Feed } from "@/pages/Feed";
import { Chat } from "@/pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <AppHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/create" element={<div className="p-4 pb-24"><h1>Create Basket - Coming Soon</h1></div>} />
              <Route path="/notifications" element={<div className="p-4 pb-24"><h1>Notifications - Coming Soon</h1></div>} />
              <Route path="/profile" element={<div className="p-4 pb-24"><h1>Profile - Coming Soon</h1></div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
