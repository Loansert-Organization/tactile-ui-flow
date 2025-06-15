
import React from 'react';
import { StepperBar } from './StepperBar';
import { StepProps } from '@/types/wizard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Step2: React.FC<StepProps> = ({
  basketData,
  updateBasketData,
  onBack,
  onNext,
  handlePress
}) => (
  <div className="wizard-step">
    <div className="max-w-md mx-auto p-5 mt-24 bg-white/5 rounded-xl shadow-sm">
      <div className="mb-4">
        <StepperBar currentStep={2} />
      </div>
      {/* Contribution Type */}
      <div className="mb-3">
        <label className="block text-xs mb-1 text-gray-300">Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => updateBasketData?.('contributionType', 'recurring')}
            className={`flex-1 py-2 rounded-lg text-sm border transition ${
              basketData.contributionType === 'recurring'
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-white/15 bg-transparent'
            }`}
          >
            Recurring
          </button>
          <button
            onClick={() => updateBasketData?.('contributionType', 'one-off')}
            className={`flex-1 py-2 rounded-lg text-sm border transition ${
              basketData.contributionType === 'one-off'
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-white/15 bg-transparent'
            }`}
          >
            One-Off
          </button>
        </div>
      </div>
      {/* Frequency */}
      {basketData.contributionType === 'recurring' && (
        <div className="mb-3">
          <label className="block text-xs mb-1 text-gray-300">Frequency</label>
          <select
            value={basketData.frequency}
            onChange={e => updateBasketData?.('frequency', e.target.value)}
            className="w-full py-2 rounded-lg border border-white/15 bg-transparent text-sm text-white"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
      )}
      {/* Anonymity */}
      <div className="mb-3">
        <label className="block text-xs mb-1 text-gray-300">Display</label>
        <div className="flex gap-2">
          <button
            onClick={() => updateBasketData?.('anonymity', 'named')}
            className={`flex-1 py-2 rounded-lg text-sm border transition ${
              basketData.anonymity === 'named'
                ? 'border-orange-400 bg-orange-400/10'
                : 'border-white/15 bg-transparent'
            }`}
          >
            Names
          </button>
          <button
            onClick={() => updateBasketData?.('anonymity', 'anonymous')}
            className={`flex-1 py-2 rounded-lg text-sm border transition ${
              basketData.anonymity === 'anonymous'
                ? 'border-orange-400 bg-orange-400/10'
                : 'border-white/15 bg-transparent'
            }`}
          >
            Anonymous
          </button>
        </div>
      </div>
      {/* Duration */}
      {basketData.contributionType === 'recurring' && (
        <div className="mb-4">
          <label className="block text-xs mb-1 text-gray-300">Months</label>
          <Input
            type="number"
            value={basketData.duration}
            onChange={e => updateBasketData?.('duration', e.target.value)}
            min={1}
            placeholder="12"
            className="w-full py-2 rounded-lg border border-white/15 bg-transparent text-sm text-white placeholder:text-gray-400"
          />
        </div>
      )}
      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <Button
          type="button"
          variant="ghost"
          className="flex-1 text-gray-400 border border-white/15 bg-transparent"
          onClick={e => {
            handlePress(e);
            onBack();
          }}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-2 rounded-lg disabled:opacity-40"
          onClick={e => {
            handlePress(e);
            onNext?.();
          }}
          disabled={
            basketData.contributionType === 'recurring' && !basketData.duration.trim()
          }
        >
          Create
        </Button>
      </div>
    </div>
  </div>
);
