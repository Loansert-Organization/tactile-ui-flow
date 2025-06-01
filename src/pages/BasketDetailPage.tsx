
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Settings, 
  Users, 
  Target, 
  Calendar,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Phone,
  Clock,
  TrendingUp,
  AlertCircle,
  RefreshCcw,
  Lock,
  Globe,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { usePressFeedback, useLongPress } from '@/hooks/useInteractions';
import { formatCurrency } from '@/lib/formatters';

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
  createdByAdmin: boolean; // New field
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
const isDirectLink = true; // In real app, this would be determined by how user accessed the page

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
  createdByAdmin: type === 'public', // Public baskets are admin-created
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

const StatusBanner = ({ status }: { status: 'pending' | 'approved' | 'private' }) => {
  if (status === 'private') return null;

  return (
    <div className={`p-4 mx-4 mt-4 rounded-lg border ${
      status === 'pending' 
        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' 
        : 'bg-green-500/10 border-green-500/20 text-green-300'
    }`}>
      <div className="flex items-center gap-2 text-sm font-medium">
        {status === 'pending' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>🔄 This basket is pending review.</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>✅ This basket is live!</span>
          </>
        )}
      </div>
    </div>
  );
};

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

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
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
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              {basketData.isCreator && (
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
        <StatusBanner status={basketData.status} />

        <div className="p-4 space-y-6">
          {/* Basket Info */}
          <GlassCard className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold gradient-text mb-2">{basketData.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{basketData.members.length} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{basketData.daysLeft} days left</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                    {basketData.type === 'private' ? (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{basketData.description}</p>

            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Progress</span>
                <span className="font-semibold gradient-text-blue">{basketData.progress}%</span>
              </div>
              
              <Progress value={basketData.progress} className="h-3" />

              <div className="flex items-center justify-between text-sm">
                {/* Business Rule 2: Hide balance for private baskets */}
                {basketData.privacy === 'private' ? (
                  <span className="text-gray-400 italic">Balance hidden for private baskets</span>
                ) : (
                  <span className="text-gray-400">{formatCurrency(basketData.currentAmount)}</span>
                )}
                <div className="flex items-center gap-1 text-gray-400">
                  <Target className="w-4 h-4" />
                  <span>{formatCurrency(basketData.goal)}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Tab Navigation */}
          <div className="flex rounded-lg bg-white/5 p-1">
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'members'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Members
            </button>
            <button
              onClick={() => setActiveTab('contributions')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'contributions'
                  ? 'bg-gradient-purple-pink text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Timeline
            </button>
          </div>

          {/* Members Tab */}
          {activeTab === 'members' && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Members ({basketData.members.length})</h3>
              
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {basketData.members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      basketType={basketData.type}
                      basketPrivacy={basketData.privacy}
                      isCreator={basketData.isCreator}
                      isCurrentUserCreator={isCurrentUserCreator}
                      hideMyPhone={hideMyPhone}
                      onTogglePhoneVisibility={handleTogglePhoneVisibility}
                      onCopyCode={handleCopyCode}
                    />
                  ))}
                </div>
              </ScrollArea>
            </GlassCard>
          )}

          {/* Contributions Tab */}
          {activeTab === 'contributions' && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Contributions</h3>
              
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {basketData.contributions.map((contribution) => (
                    <div key={contribution.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-gradient-teal-blue flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold">{contribution.memberCode.slice(-2)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{formatCurrency(contribution.amount)}</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(contribution.timestamp)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">Code: {contribution.memberCode}</p>
                        {contribution.message && (
                          <p className="text-sm text-gray-300 mt-1">"{contribution.message}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </GlassCard>
          )}
        </div>

        {/* Business Rule 1: Floating Action Button - Disabled for creators */}
        {isCurrentUserCreator ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled
                className="fixed bottom-6 right-6 w-14 h-14 bg-gray-500/50 rounded-full shadow-2xl flex items-center justify-center opacity-50 cursor-not-allowed z-50"
                aria-label="Cannot contribute to own basket"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You cannot contribute to your own basket</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={handleContribute}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-magenta-orange rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
            aria-label="Add contribution"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </TooltipProvider>
  );
};

// Member Card Component
interface MemberCardProps {
  member: Member;
  basketType: 'private' | 'public';
  basketPrivacy: 'private' | 'public';
  isCreator: boolean;
  isCurrentUserCreator: boolean;
  hideMyPhone: boolean;
  onTogglePhoneVisibility: (value: boolean) => void;
  onCopyCode: (code: string) => void;
}

const MemberCard = ({ 
  member, 
  basketType, 
  basketPrivacy,
  isCreator, 
  isCurrentUserCreator,
  hideMyPhone, 
  onTogglePhoneVisibility, 
  onCopyCode 
}: MemberCardProps) => {
  const { handlePress } = usePressFeedback();
  
  const longPressProps = useLongPress(() => {
    if (basketType === 'private' && member.phone && shouldShowPhone) {
      toast({
        title: "Phone Number",
        description: member.phone,
      });
    }
  });

  const handleCopyCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handlePress(e);
    onCopyCode(member.code);
  };

  // Business Rule 3: Phone visibility logic
  const shouldShowPhone = basketPrivacy === 'private' && member.phone;
  const canSeePhoneNumbers = isCurrentUserCreator; // Only creator can see phone numbers in private baskets
  const shouldHidePhone = member.hidePhone && !isCreator && !member.isCurrentUser;
  
  // For public baskets, never show phone numbers
  // For private baskets, only show if user is creator or it's their own phone
  let displayPhone = '';
  if (basketPrivacy === 'public') {
    displayPhone = ''; // Never show for public baskets
  } else if (basketPrivacy === 'private') {
    if (canSeePhoneNumbers || member.isCurrentUser) {
      displayPhone = shouldHidePhone ? '••••••••••' : member.phone;
    } else {
      displayPhone = ''; // Hide completely for non-creators
    }
  }

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-purple-pink flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {member.code.slice(-2)}
            </span>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="font-mono text-sm font-semibold hover:gradient-text transition-all"
              >
                {member.code}
              </button>
              <button onClick={handleCopyCode} className="p-1 rounded hover:bg-white/10">
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
              {member.isCurrentUser && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                  You
                </span>
              )}
            </div>
            
            {/* Business Rule 3: Conditional phone display */}
            {shouldShowPhone && displayPhone && (
              <div className="flex items-center gap-2 mt-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span 
                      className="text-xs text-gray-400 cursor-pointer"
                      {...longPressProps}
                    >
                      <Phone className="w-3 h-3 inline mr-1" />
                      {displayPhone}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Long press to view</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* Phone visibility toggle for current user in private baskets */}
        {member.isCurrentUser && basketType === 'private' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Hide phone</span>
            <Switch
              checked={hideMyPhone}
              onCheckedChange={onTogglePhoneVisibility}
            />
            {hideMyPhone ? (
              <EyeOff className="w-4 h-4 text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketDetailPage;
