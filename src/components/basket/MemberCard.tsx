
import React from 'react';
import { Copy, Phone, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { usePressFeedback, useLongPress } from '@/hooks/useInteractions';

interface Member {
  id: string;
  code: string;
  phone: string;
  hidePhone: boolean;
  isCurrentUser?: boolean;
}

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

export const MemberCard = ({ 
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
