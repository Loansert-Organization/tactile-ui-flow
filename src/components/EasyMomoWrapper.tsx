import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "../../features/easy-momo/src/components/ErrorBoundary";
import HomeScreen from "../../features/easy-momo/src/components/HomeScreen";
import PayScreen from "../../features/easy-momo/src/components/PayScreen";
import GetPaidScreen from "../../features/easy-momo/src/components/GetPaidScreen";
import QRPreviewScreen from "../../features/easy-momo/src/components/QRPreviewScreen";
import SharedPaymentPage from "../../features/easy-momo/src/components/SharedPaymentPage";
import PaymentHistory from "../../features/easy-momo/src/components/PaymentHistory";
import TestDashboard from "../../features/easy-momo/src/components/TestDashboard";
import NotFound from "../../features/easy-momo/src/pages/NotFound";
import Login from "../../features/easy-momo/src/pages/Login";
import Verified from "../../features/easy-momo/src/pages/Verified";
import PWAUpdateBanner from "../../features/easy-momo/src/components/PWAUpdateBanner";
import { analyticsService } from "../../features/easy-momo/src/services/analyticsService";
import "../../features/easy-momo/src/services/errorMonitoringService";
import "../../features/easy-momo/src/styles/liquid-glass-theme.css";

// Create a separate QueryClient for easy-momo to avoid conflicts
const easyMomoQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const EasyMomoWrapper = () => {
  useEffect(() => {
    try {
      // Track easy-momo feature initialization
      analyticsService.trackEvent('easy_momo_initialized', {
        integration_method: 'subtree',
        parent_app: 'ikanisa',
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      });

      // Track page views on route changes within easy-momo
      const trackPageView = () => {
        const path = window.location.pathname;
        if (path.startsWith('/easy-momo')) {
          analyticsService.trackPageView(path);
        }
      };

      // Initial page view
      trackPageView();

      // Listen for route changes
      window.addEventListener('popstate', trackPageView);
      
      return () => {
        window.removeEventListener('popstate', trackPageView);
      };
    } catch (error) {
      console.error('Easy-Momo initialization error:', error);
    }
  }, []);

  return (
    <div className="liquid-theme min-h-screen">
      <div className="liquid-bg" />
      <div className="liquid-content">
        <ErrorBoundary>
          <QueryClientProvider client={easyMomoQueryClient}>
            <TooltipProvider>
              <PWAUpdateBanner />
              <Routes>
                <Route index element={<HomeScreen />} />
                <Route path="pay" element={<PayScreen />} />
                <Route path="get-paid" element={<GetPaidScreen />} />
                <Route path="qr-preview" element={<QRPreviewScreen />} />
                <Route path="shared/:linkToken" element={<SharedPaymentPage />} />
                <Route path="history" element={<PaymentHistory />} />
                <Route path="test" element={<TestDashboard />} />
                <Route path="login" element={<Login />} />
                <Route path="verified" element={<Verified />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default EasyMomoWrapper; 