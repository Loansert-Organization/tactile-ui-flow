
import React from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { AuthPromptModal } from '@/components/wizard/AuthPromptModal';

interface BasketWizardModalsProps {
  showAuthPrompt: boolean;
  showExitConfirm: boolean;
  basketName: string;
  onCloseAuthPrompt: () => void;
  onCloseExitConfirm: () => void;
  onExitConfirm: () => void;
  onProceedAsGuest: () => void;
}

export const BasketWizardModals: React.FC<BasketWizardModalsProps> = ({
  showAuthPrompt,
  showExitConfirm,
  basketName,
  onCloseAuthPrompt,
  onCloseExitConfirm,
  onExitConfirm,
  onProceedAsGuest
}) => {
  return (
    <>
      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={onCloseAuthPrompt}
        basketName={basketName}
        onProceedAsGuest={onProceedAsGuest}
      />

      <ConfirmationDialog
        isOpen={showExitConfirm}
        onClose={onCloseExitConfirm}
        onConfirm={onExitConfirm}
        title="Discard Changes?"
        description="You have unsaved changes. Are you sure you want to leave without creating your basket?"
        confirmText="Discard"
        cancelText="Continue Editing"
        variant="destructive"
      />
    </>
  );
};
