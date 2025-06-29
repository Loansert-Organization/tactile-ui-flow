import React, { useState } from 'react';
import { Crown, UserMinus, MoreVertical, Calendar, CreditCard, Shield } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BasketMember } from '@/hooks/baskets/types';
import { formatCurrency } from '@/lib/formatters';
import { useAuthContext } from '@/contexts/AuthContext';

interface MemberCardProps {
  member: BasketMember;
  isCreator?: boolean;
  canManageMembers?: boolean;
  rank?: number;
  onRemoveMember?: (userId: string) => void;
  loading?: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  isCreator,
  canManageMembers,
  rank,
  onRemoveMember,
  loading = false
}) => {
  const { user } = useAuthContext();
  const [showDetails, setShowDetails] = useState(false);
  const [removing, setRemoving] = useState(false);

  const isCurrentUser = user?.id === member.user_id;
  const canRemove = canManageMembers && !member.is_creator && (isCreator || user?.role === 'admin');

  const handleRemoveMember = async () => {
    if (!onRemoveMember) return;
    
    try {
      setRemoving(true);
      await onRemoveMember(member.user_id);
    } catch (error) {
      console.error('Error removing member:', error);
    } finally {
      setRemoving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankBadge = () => {
    if (rank === 1) return { text: 'TOP', color: 'bg-gradient-to-r from-yellow-400 to-orange-500' };
    if (rank === 2) return { text: '2ND', color: 'bg-gradient-to-r from-gray-400 to-gray-600' };
    if (rank === 3) return { text: '3RD', color: 'bg-gradient-to-r from-amber-600 to-amber-800' };
    return null;
  };

  const rankBadge = getRankBadge();

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              {member.users.avatar_url ? (
                <img 
                  src={member.users.avatar_url} 
                  alt={member.users.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-white">
                  {getInitials(member.users.display_name)}
                </span>
              )}
            </div>
            {member.users.role === 'admin' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">
                {member.users.display_name}
                {isCurrentUser && <span className="text-xs text-muted-foreground ml-1">(You)</span>}
              </h3>
              
              {member.is_creator && (
                <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              )}
              
              {rankBadge && (
                <span className={`text-xs text-white px-2 py-1 rounded-full font-bold flex-shrink-0 ${rankBadge.color}`}>
                  {rankBadge.text}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{member.users.country}</span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                {member.contributions.count} contributions
              </span>
            </div>
          </div>
        </div>

        {/* Amount & Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatCurrency(member.contributions.total_amount_usd)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(member.contributions.total_amount_local)} RWF
            </div>
          </div>

          {/* Actions Menu */}
          {(canRemove || !isCurrentUser) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  View Details
                </DropdownMenuItem>
                {canRemove && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {member.users.display_name} from this basket? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleRemoveMember}
                          disabled={removing}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {removing ? 'Removing...' : 'Remove Member'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Member Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                {member.users.avatar_url ? (
                  <img 
                    src={member.users.avatar_url} 
                    alt={member.users.display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {getInitials(member.users.display_name)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{member.users.display_name}</h3>
                <div className="flex items-center gap-2">
                  {member.is_creator && <Badge variant="default">Creator</Badge>}
                  {member.users.role === 'admin' && <Badge variant="secondary">Admin</Badge>}
                  <span className="text-sm text-muted-foreground">{member.users.country}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Contributions</p>
                <p className="text-lg font-bold">{member.contributions.count}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Amount</p>
                <p className="text-lg font-bold">{formatCurrency(member.contributions.total_amount_usd)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Member Since</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(member.joined_at).toLocaleDateString()}
              </div>
            </div>

            {member.contributions.latest_contribution_at && (
              <div>
                <p className="text-sm font-medium mb-2">Latest Contribution</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  {new Date(member.contributions.latest_contribution_at).toLocaleDateString()}
                </div>
              </div>
            )}

            {member.users.phone_number && (
              <div>
                <p className="text-sm font-medium mb-2">Contact</p>
                <p className="text-sm text-muted-foreground">{member.users.phone_number}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
};
