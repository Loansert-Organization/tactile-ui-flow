import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Settings,
  AlertCircle,
  RefreshCcw,
  QrCode
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
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
import { Skeleton } from '@/components/ui/skeleton';

interface Member {
  id: string;
  code: string;
  phone: string;
  hidePhone: boolean;
  isCurrentUser?: boolean;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  total_contributions?: number;
}

interface Contribution {
  id: string;
  memberCode: string;
  amount: number;
  timestamp: Date;
  message?: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
}

interface BasketData {
  id: string;
  name: string;
  title: string;
  description: string;
  type: 'private' | 'public';
  goal: number;
  goal_amount: number;
  currentAmount: number;
  current_amount: number;
  progress: number;
  daysLeft: number;
  isCreator: boolean;
  creatorId: string;
  creator_id: string;
  privacy: 'private' | 'public';
  is_private: boolean;
  createdByAdmin: boolean;
  members: Member[];
  contributions: Contribution[];
  status: 'pending' | 'approved' | 'private';
  participants_count: number;
  created_at: string;
  country: string;
  currency: string;
  category: string;
  duration_days: number;
}

const BasketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  
  // State
  const [hideMyPhone, setHideMyPhone] = useState(false);
  const [activeTab, setActiveTab] = useState<'members' | 'contributions'>('members');
  const [showQRModal, setShowQRModal] = useState(false);

  // Fetch basket data
  const { data: basketData, isLoading, error, refetch } = useQuery({
    queryKey: ['basket', id],
    queryFn: async () => {
      if (!id) throw new Error('No basket ID provided');

      const { data, error } = await supabase
        .from('baskets')
        .select(`
          *,
          basket_members!inner(
            id,
            user_id,
            is_creator,
            users(display_name, avatar_url, phone_number)
          ),
          contributions(
            id,
            user_id,
            amount_usd,
            amount_local,
            currency,
            created_at,
            message,
            confirmed,
            users(display_name, avatar_url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Basket not found');

      // Check if current user is a member or if basket is public
      const currentUserIsMember = data.basket_members?.some(
        (member: any) => member.user_id === user?.id
      );
      const isPublicBasket = !data.is_private;

      if (!currentUserIsMember && !isPublicBasket) {
        throw new Error('Access denied: This is a private basket');
      }

      // Transform data to match component interface
      const currentAmount = data.contributions?.reduce(
        (sum: number, c: any) => sum + (c.confirmed ? c.amount_usd : 0), 0
      ) || 0;

      const progress = data.goal_amount > 0 ? Math.round((currentAmount / data.goal_amount) * 100) : 0;

      // Calculate days left
      const createdDate = new Date(data.created_at);
      const daysLeft = Math.max(0, data.duration_days - Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

      // Transform members data
      const members: Member[] = data.basket_members?.map((member: any) => ({
        id: member.id,
        code: member.id.slice(-6).toUpperCase(), // Generate code from member ID
        phone: member.users?.phone_number || '',
        hidePhone: false, // This would come from user preferences in real app
        isCurrentUser: member.user_id === user?.id,
        user_id: member.user_id,
        display_name: member.users?.display_name,
        avatar_url: member.users?.avatar_url,
        total_contributions: data.contributions?.filter((c: any) => c.user_id === member.user_id && c.confirmed)
          .reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0
      })) || [];

      // Transform contributions data
      const contributions: Contribution[] = data.contributions?.filter((c: any) => c.confirmed).map((contribution: any) => ({
        id: contribution.id,
        memberCode: contribution.user_id.slice(-6).toUpperCase(),
        amount: contribution.amount_usd,
        timestamp: new Date(contribution.created_at),
        message: contribution.message,
        user_id: contribution.user_id,
        display_name: contribution.users?.display_name,
        avatar_url: contribution.users?.avatar_url
      })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) || [];

      const transformedData: BasketData = {
        ...data,
        name: data.title,
        title: data.title,
        goal: data.goal_amount,
        goal_amount: data.goal_amount,
        currentAmount,
        current_amount: currentAmount,
        progress,
        daysLeft,
        isCreator: data.creator_id === user?.id,
        creatorId: data.creator_id,
        creator_id: data.creator_id,
        privacy: data.is_private ? 'private' : 'public',
        type: data.is_private ? 'private' : 'public',
        createdByAdmin: false, // This would need to be determined based on creator role
        members,
        contributions,
        status: data.is_private ? 'private' : 'approved'
      };

      return transformedData;
    },
    enabled: !!id,
    retry: 1
  });

  // Delete basket mutation
  const deleteBasketMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('No basket ID');
      
      const { error } = await supabase
        .from('baskets')
        .delete()
        .eq('id', id)
        .eq('creator_id', user?.id); // Ensure only creator can delete

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Basket Deleted",
        description: "Your basket has been permanently deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      navigate('/baskets/mine');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete basket",
        variant: "destructive"
      });
    }
  });

  // Toggle phone visibility mutation
  const togglePhoneVisibilityMutation = useMutation({
    mutationFn: async (hidePhone: boolean) => {
      // In a real app, this would update user preferences
      // For now, we'll just update local state
      return hidePhone;
    },
    onSuccess: (hidePhone) => {
      setHideMyPhone(hidePhone);
      toast({
        title: hidePhone ? "Phone Hidden" : "Phone Visible",
        description: hidePhone ? "Your phone number is now hidden from other members" : "Your phone number is now visible to other members",
      });
    }
  });

  // Business Rule: Check if current user is creator
  const isCurrentUserCreator = basketData?.creator_id === user?.id;

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
    togglePhoneVisibilityMutation.mutate(newValue);
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

  const handleDeleteBasket = () => {
    if (window.confirm('Are you sure you want to delete this basket? This action cannot be undone.')) {
      deleteBasketMutation.mutate();
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
        </header>
        
        <div className="p-4 space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !basketData) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    const isAccessDenied = errorMessage.includes('Access denied') || errorMessage.includes('private basket');
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isAccessDenied ? 'Access Denied' : 'Basket Not Found'}
          </h3>
          <p className="text-gray-400 mb-6"> 
            {isAccessDenied 
              ? 'This basket is private. Only members can view it.'
              : errorMessage
            }
          </p>
          <div className="space-y-3">
            {!isAccessDenied && (
              <GradientButton onClick={handleRetry} className="w-full">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </GradientButton>
            )}
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
            >
              Go to Home
            </button>
          </div>
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
              
              {isCurrentUserCreator && (
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
                        <GradientButton 
                          variant="secondary" 
                          className="w-full bg-red-500/20 hover:bg-red-500/30"
                          onClick={handleDeleteBasket}
                          loading={deleteBasketMutation.isPending}
                        >
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
        <StatusBanner status={basketData?.status || 'approved'} />

        <div className="p-4 space-y-6">
          {/* Basket Info */}
          <BasketInfoCard basketData={basketData} />

          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {/* Members Tab */}
          {activeTab === 'members' && (
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
          {activeTab === 'contributions' && (
            <ContributionsTab contributions={basketData.contributions} />
          )}
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          isCurrentUserCreator={isCurrentUserCreator}
          onContribute={handleContribute}
        />

        {/* QR Code Modal */}
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          basketId={basketData.id}
          basketName={basketData.name}
          basketURL={`${window.location.origin}/basket/${basketData.id}`}
        />
      </div>
    </TooltipProvider>
  );
};

export default BasketDetailPage;
