
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MemberCard } from './MemberCard';

interface Member {
  id: string;
  code: string;
  phone: string;
  hidePhone: boolean;
  isCurrentUser?: boolean;
}

interface MembersTabProps {
  members: Member[];
  basketType: 'private' | 'public';
  basketPrivacy: 'private' | 'public';
  isCreator: boolean;
  isCurrentUserCreator: boolean;
  hideMyPhone: boolean;
  onTogglePhoneVisibility: (value: boolean) => void;
  onCopyCode: (code: string) => void;
}

export const MembersTab = ({
  members,
  basketType,
  basketPrivacy,
  isCreator,
  isCurrentUserCreator,
  hideMyPhone,
  onTogglePhoneVisibility,
  onCopyCode
}: MembersTabProps) => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold mb-4">Members ({members.length})</h3>
      
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              basketType={basketType}
              basketPrivacy={basketPrivacy}
              isCreator={isCreator}
              isCurrentUserCreator={isCurrentUserCreator}
              hideMyPhone={hideMyPhone}
              onTogglePhoneVisibility={onTogglePhoneVisibility}
              onCopyCode={onCopyCode}
            />
          ))}
        </div>
      </ScrollArea>
    </GlassCard>
  );
};
