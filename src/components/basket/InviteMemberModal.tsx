import React, { useState } from 'react';
import { UserPlus, Phone, MessageSquare, Send, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { MemberInvitation } from '@/hooks/baskets/types';
import { toast } from 'sonner';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  basketName: string;
  basketId: string;
  onInvite: (invitation: MemberInvitation) => Promise<void>;
  loading?: boolean;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  basketName,
  basketId,
  onInvite,
  loading = false
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [inviteMethod, setInviteMethod] = useState<'link' | 'direct'>('direct');
  const [inviting, setInviting] = useState(false);

  const inviteUrl = `${window.location.origin}/basket/${basketId}/join`;
  const defaultMessage = `You've been invited to join "${basketName}" basket! Join us in saving together: ${inviteUrl}`;

  const handleInvite = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    try {
      setInviting(true);
      await onInvite({
        phone_number: phoneNumber.trim(),
        message: customMessage.trim() || defaultMessage
      });
      
      // Reset form
      setPhoneNumber('');
      setCustomMessage('');
      onClose();
    } catch (error) {
      console.error('Error inviting member:', error);
    } finally {
      setInviting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invite link copied to clipboard!');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    const message = customMessage.trim() || defaultMessage;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${basketName}`,
          text: message,
          url: inviteUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Members to {basketName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Method Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={inviteMethod === 'direct' ? 'default' : 'outline'}
              onClick={() => setInviteMethod('direct')}
              className="flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Direct Invite
            </Button>
            <Button
              variant={inviteMethod === 'link' ? 'default' : 'outline'}
              onClick={() => setInviteMethod('link')}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Share Link
            </Button>
          </div>

          {inviteMethod === 'direct' ? (
            <>
              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+250781234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the phone number with country code (e.g., +250781234567)
                </p>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="message"
                    placeholder={defaultMessage}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="pl-10 min-h-[80px]"
                    maxLength={500}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {customMessage.length}/500 characters
                </p>
              </div>

              {/* Invite Button */}
              <Button
                onClick={handleInvite}
                disabled={inviting || loading || !phoneNumber.trim()}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {inviting ? 'Sending Invite...' : 'Send Invitation'}
              </Button>
            </>
          ) : (
            <>
              {/* Share Link Section */}
              <GlassCard className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label>Basket Invite Link</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={inviteUrl}
                        readOnly
                        className="flex-1 text-xs"
                      />
                      <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Custom Message for Sharing */}
                  <div>
                    <Label htmlFor="shareMessage">Share Message (Optional)</Label>
                    <Textarea
                      id="shareMessage"
                      placeholder={defaultMessage}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="mt-2 min-h-[60px]"
                      maxLength={500}
                    />
                  </div>

                  {/* Share Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Share
                    </Button>
                    <Button
                      onClick={() => {
                        const message = customMessage.trim() || defaultMessage;
                        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      variant="default"
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </>
          )}

          {/* Cancel Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 