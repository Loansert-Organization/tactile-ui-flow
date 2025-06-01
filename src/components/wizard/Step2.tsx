
import React from 'react';
import { ArrowLeft, Check, Users, Eye } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StepperBar } from './StepperBar';
import { StepProps } from '@/types/wizard';

export const Step2: React.FC<StepProps> = ({ basketData, updateBasketData, onBack, onNext, handlePress }) => (
  <div className="wizard-step">
    <GlassCard className="max-w-md mx-auto p-6 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={(e) => { handlePress(e); onBack(); }} 
            className="p-2 rounded-lg hover:bg-white/10 neuro-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <StepperBar currentStep={2} />
          <div className="w-9" />
        </div>

        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3 neuro-button">
              <Users className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Contribution Settings
            </h2>
            <p className="text-gray-400 text-sm mt-1">Configure how contributions work</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-200">Contribution Type</label>
            <div className="space-y-3">
              <button
                onClick={() => updateBasketData?.('contributionType', 'recurring')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.contributionType === 'recurring' 
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium">Recurring Contributions</p>
                  <p className="text-xs text-gray-400">Regular scheduled contributions</p>
                </div>
              </button>

              <button
                onClick={() => updateBasketData?.('contributionType', 'one-off')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.contributionType === 'one-off' 
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium">One-Off Contributions</p>
                  <p className="text-xs text-gray-400">Flexible one-time contributions</p>
                </div>
              </button>
            </div>
          </div>

          {basketData.contributionType === 'recurring' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Contribution Frequency</label>
              <select 
                value={basketData.frequency}
                onChange={(e) => updateBasketData?.('frequency', e.target.value)}
                className="w-full p-3 rounded-lg glass-input text-white"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-200">Contribution Display</label>
            <div className="space-y-3">
              <button
                onClick={() => updateBasketData?.('anonymity', 'named')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.anonymity === 'named' 
                    ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Show Names</p>
                    <p className="text-xs text-gray-400">Members can see who contributed</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => updateBasketData?.('anonymity', 'anonymous')}
                className={`w-full p-4 rounded-lg border-2 transition-all neuro-button ${
                  basketData.anonymity === 'anonymous' 
                    ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/25' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Anonymous</p>
                    <p className="text-xs text-gray-400">Only amounts are visible</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {basketData.contributionType === 'recurring' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Duration (months)</label>
              <Input
                type="number"
                value={basketData.duration}
                onChange={(e) => updateBasketData?.('duration', e.target.value)}
                placeholder="12"
                className="glass-input text-white placeholder:text-gray-400"
              />
            </div>
          )}

          <Button 
            onClick={(e) => { handlePress(e); onNext?.(); }}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 neuro-button text-white font-semibold py-3 text-base"
            disabled={basketData.contributionType === 'recurring' && !basketData.duration.trim()}
          >
            Create Private Basket <Check className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </GlassCard>
  </div>
);
