
import React, { useState } from 'react';
import { ArrowLeft, Heart, Settings, Plus, Share2, Bell, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { FAB } from '@/components/ui/fab';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export const UIShowcase = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);

  const handleConfirm = async () => {
    setConfirmationLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConfirmationLoading(false);
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-background safe-area-full">
      {/* Header */}
      <div className="container-fluid py-6">
        <div className="flex items-center justify-between mb-6">
          <EnhancedButton 
            variant="glass" 
            size="icon"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-5 h-5" />}
          />
          <h1 className="text-2xl font-bold gradient-text">UI Showcase</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="container-fluid space-y-8 pb-24">
        {/* Glass Cards Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold gradient-text-primary">Glass Cards</h2>
          <div className="responsive-grid">
            <GlassCard variant="default" className="p-6">
              <h3 className="font-semibold mb-2">Default Glass</h3>
              <p className="text-muted-foreground text-sm">Standard liquid glass effect with subtle transparency.</p>
            </GlassCard>
            
            <GlassCard variant="strong" className="p-6">
              <h3 className="font-semibold mb-2">Strong Glass</h3>
              <p className="text-muted-foreground text-sm">Enhanced glass effect with stronger blur and opacity.</p>
            </GlassCard>
            
            <GlassCard variant="glow" hover className="p-6">
              <h3 className="font-semibold mb-2">Glow Effect</h3>
              <p className="text-muted-foreground text-sm">Interactive glass card with glow on hover.</p>
            </GlassCard>
          </div>
        </section>

        {/* Enhanced Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold gradient-text-primary">Enhanced Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <EnhancedButton variant="gradient-primary">
              Gradient Primary
            </EnhancedButton>
            
            <EnhancedButton variant="gradient-accent" icon={<Heart className="w-4 h-4" />}>
              With Icon
            </EnhancedButton>
            
            <EnhancedButton variant="glass" glow>
              Glass Button
            </EnhancedButton>
            
            <EnhancedButton variant="outline" size="lg">
              Large Outline
            </EnhancedButton>
          </div>
        </section>

        {/* Gradient Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold gradient-text-primary">Gradient Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <GradientButton variant="primary" glow>
              Primary Gradient
            </GradientButton>
            
            <GradientButton variant="accent" size="lg">
              Accent Large
            </GradientButton>
            
            <GradientButton variant="glass" shimmer={false}>
              Glass Gradient
            </GradientButton>
          </div>
        </section>

        {/* Enhanced Cards Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold gradient-text-primary">Enhanced Cards</h2>
          <div className="responsive-grid">
            <EnhancedCard variant="glass" interactive glow="primary" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Interactive Glass</h3>
                  <p className="text-sm text-muted-foreground">Hover for glow effect</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">This card demonstrates interactive liquid glass with primary glow.</p>
            </EnhancedCard>
            
            <EnhancedCard variant="gradient" interactive className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Gradient Card</h3>
                  <p className="text-sm text-muted-foreground">Subtle gradient background</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">Enhanced card with gradient background and interactive hover.</p>
            </EnhancedCard>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold gradient-text-primary">Interactive Demo</h2>
          <GlassCard className="p-6 text-center">
            <h3 className="font-semibold mb-4">Confirmation Dialog Demo</h3>
            <p className="text-muted-foreground mb-6">Test the enhanced confirmation dialog with liquid glass effects.</p>
            <EnhancedButton 
              variant="gradient-primary" 
              onClick={() => setShowConfirmation(true)}
            >
              Show Confirmation
            </EnhancedButton>
          </GlassCard>
        </section>

        {/* Typography Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold gradient-text-primary">Enhanced Typography</h2>
          <GlassCard className="p-6 space-y-4">
            <h1 className="gradient-text">Large Gradient Heading</h1>
            <h2 className="gradient-text-primary">Primary Gradient Title</h2>
            <h3 className="gradient-text-accent">Accent Gradient Subtitle</h3>
            <p className="text-muted-foreground leading-relaxed">
              This demonstrates the enhanced typography system with gradient text effects and improved readability.
              The design maintains accessibility while adding visual appeal through subtle gradient applications.
            </p>
          </GlassCard>
        </section>
      </div>

      {/* Floating Action Button */}
      <FAB
        variant="primary"
        icon={<Plus className="w-6 h-6" />}
        label="Add New"
        position="bottom-right"
        glow
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title="Confirm Action"
        description="This is a demonstration of the enhanced confirmation dialog with liquid glass effects and smooth animations."
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        loading={confirmationLoading}
      />
    </div>
  );
};
