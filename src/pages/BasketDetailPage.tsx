import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Settings,
  AlertCircle,
  RefreshCcw,
  QrCode
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { usePressFeedback } from '@/hooks/useInteractions';
import { StatusBanner } from '@/components/basket/StatusBanner';
import { BasketInfoCard } from '@/components/basket/BasketInfoCard';
import { TabNavigation } from '@/components/basket/TabNavigation';
import { MembersTab } from '@/components/basket/MembersTab';
import { ContributionsTab } from '@/components/basket/ContributionsTab';
import { FloatingActionButton } from '@/components/basket/FloatingActionButton';
import { QRCodeModal } from '@/components/QRCodeModal';

interface Member {
  id: string;
  code: string;
  phone: string;
  hidePhone: boolean;
  isCurrentUser?: boolean;
}

interface Contribution {
  id: string;
  memberCode: string;
  amount: number;
  timestamp: Date;
  message?: string;
}

interface BasketData {
  id: string;
  name: string;
  description: string;
  type: 'private' | 'public';
  goal: number;
  currentAmount: number;
  progress: number;
  daysLeft: number;
  isCreator: boolean;
  creatorId: string;
  privacy: 'private' | 'public';
  createdByAdmin: boolean;
  members: Member[];
  contributions: Contribution[];
  status: 'pending' | 'approved' | 'private';
}

// Dummy current user for business logic
const currentUser = {
  uid: 'user123',
  code: '123456'
};

// Simulate direct link access
const isDirectLink = true;

// Dummy data with admin flag
const getDummyBasketData = (type: 'private' | 'public'): BasketData => ({
  id: '1',
  name: 'Team Championship Fund',
  description: 'Supporting our team to get that championship ring!',
  type,
  goal: 500000,
  currentAmount: 325000,
  progress: 65,
  daysLeft: 15,
  isCreator: Math.random() > 0.5,
  creatorId: Math.random() > 0.5 ? 'user123' : 'creator456',
  privacy: type,
  createdByAdmin: type === 'public',
  status: type === 'private' ? 'private' : Math.random() > 0.5 ? 'pending' : 'approved',
  members: [
    { id: '1', code: '123456', phone: '0788123456', hidePhone: false, isCurrentUser: true },
    { id: '2', code: '789012', phone: '0788654321', hidePhone: true },
    { id: '3', code: '345678', phone: '0788987654', hidePhone: false },
    { id: '4', code: '901234', phone: '0788456123', hidePhone: true },
    { id: '5', code: '567890', phone: '0788321987', hidePhone: false },
  ],
  contributions: [
    { id: '1', memberCode: '123456', amount: 50000, timestamp: new Date(Date.now() - 86400000), message: 'Let\'s do this!' },
    { id: '2', memberCode: '789012', amount: 75000, timestamp: new Date(Date.now() - 172800000) },
    { id: '3', memberCode: '345678', amount: 100000, timestamp: new Date(Date.now() - 259200000), message: 'For the team!' },
    { id: '4', memberCode: '901234', amount: 50000, timestamp: new Date(Date.now() - 345600000) },
    { id: '5', memberCode: '567890', amount: 50000, timestamp: new Date(Date.now() - 432000000) },
  ]
});

const BasketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  
  // State
  const [basketData, setBasketData] = useState<BasketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideMyPhone, setHideMyPhone] = useState(false);
  const [activeTab, setActiveTab] = useState<'members' | 'contributions'>('members');
  const [showQRModal, setShowQRModal] = useState(false);

  // Load basket data
  useEffect(() => {
    const loadBasketData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Determine basket type based on URL or other logic
        const basketType = Math.random() > 0.5 ? 'private' : 'public';
        const data = getDummyBasketData(basketType);
        
        // Check access for private baskets
        if (data.privacy === 'private' && !data.createdByAdmin && !isDirectLink) {
          setError('Basket not found or private');
          return;
        }
        
        setBasketData(data);
        setHideMyPhone(data.members.find(m => m.isCurrentUser)?.hidePhone || false);
      } catch (err) {
        setError('Failed to load basket details');
      } finally {
        setIsLoading(false);
      }
    };

    loadBasketData();
  }, [id]);

  // Auto-approve pending baskets after 5 seconds
  useEffect(() => {
    if (basketData?.status === 'pending') {
      const timer = setTimeout(() => {
        setBasketData(prev => prev ? { ...prev, status: 'approved' } : null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [basketData?.status]);

  // Business Rule 1: Check if current user is creator
  const isCurrentUserCreator = basketData?.creatorId === currentUser.uid;

  // Handlers
  const handleBack = () => navigate(-1);
  
  const handleShowQRCode = () => {
    setShowQRModal(true);
  };

  const handleShare = async () => {
    const basketUrl = `${window.location.origin}/basket/${id}`;
    await navigator.clipboard.writeText(basketUrl);
    toast({
      title: "Copied!",
      description: "Basket link copied to clipboard",
    });
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Code ${code} copied to clipboard`,
    });
  };

  const handleTogglePhoneVisibility = (newValue: boolean) => {
    setHideMyPhone(newValue);
    toast({
      title: newValue ? "Phone Hidden" : "Phone Visible",
      description: newValue ? "Your phone number is now hidden from other members" : "Your phone number is now visible to other members",
    });
  };

  const handleContribute = () => {
    if (isCurrentUserCreator) {
      toast({
        title: "Cannot Contribute",
        description: "You cannot contribute to your own basket",
        variant: "destructive"
      });
      return;
    }
    navigate(`/basket/${id}/contribute`);
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading basket details...</p>
        </GlassCard>
      </div>
    );
  }

  // Error state (including private basket access)
  if (error || !basketData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {error === 'Basket not found or private' ? 'Basket Not Found' : 'Something went wrong'}
          </h3>
          <p className="text-gray-400 mb-6">
            {error === 'Basket not found or private' 
              ? 'This basket is private or does not exist. You need a direct link to access it.'
              : error
            }
          </p>
          <GradientButton onClick={handleRetry} className="w-full">
            <RefreshCcw className="w-4 h-4 mr-2" />
            {error === 'Basket not found or private' ? 'Go Back' : 'Try Again'}
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShowQRCode}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors transform hover:scale-110"
                aria-label="Generate QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              {basketData?.isCreator && (
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Basket Settings</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-4">
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <h4 className="font-semibold text-red-400 mb-2">Danger Zone</h4>
                        <p className="text-sm text-gray-400 mb-4">This action cannot be undone.</p>
                        <GradientButton variant="secondary" className="w-full bg-red-500/20 hover:bg-red-500/30">
                          Delete Basket
                        </GradientButton>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </header>

        {/* Status Banner */}
        <StatusBanner status={basketData?.status || 'pending'} />

        <div className="p-4 space-y-6">
          {/* Basket Info */}
          {basketData && <BasketInfoCard basketData={basketData} />}

          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {/* Members Tab */}
          {activeTab === 'members' && basketData && (
            <MembersTab
              members={basketData.members}
              basketType={basketData.type}
              basketPrivacy={basketData.privacy}
              isCreator={basketData.isCreator}
              isCurrentUserCreator={isCurrentUserCreator}
              hideMyPhone={hideMyPhone}
              onTogglePhoneVisibility={handleTogglePhoneVisibility}
              onCopyCode={handleCopyCode}
            />
          )}

          {/* Contributions Tab */}
          {activeTab === 'contributions' && basketData && (
            <ContributionsTab contributions={basketData.contributions} />
          )}
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          isCurrentUserCreator={isCurrentUserCreator}
          onContribute={handleContribute}
        />

        {/* QR Code Modal */}
        {basketData && (
          <QRCodeModal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            basketId={basketData.id}
            basketName={basketData.name}
            basketURL={`${window.location.origin}/basket/${basketData.id}`}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default BasketDetailPage;
