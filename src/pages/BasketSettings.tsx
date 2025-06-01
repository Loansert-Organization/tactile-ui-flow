import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Lock, Unlock, Archive, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';

const BasketSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowAnonymous, setAllowAnonymous] = useState(true);

  // Mock basket data
  const basket = {
    name: 'Lakers Championship Ring Fund',
    description: 'Supporting our team to get that championship ring!',
    goal: 50000,
    isOwner: true
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your basket settings have been updated",
    });
  };

  const handleArchive = () => {
    toast({
      title: "Basket Archived",
      description: "Your basket has been archived and is no longer active",
    });
    navigate('/baskets/mine');
  };

  const handleDelete = () => {
    toast({
      title: "Basket Deleted",
      description: "Your basket has been permanently deleted",
      variant: "destructive"
    });
    navigate('/baskets/mine');
  };

  if (!basket.isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">Only the basket owner can access settings</p>
          <GradientButton onClick={() => navigate(-1)}>
            Go Back
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold gradient-text">Basket Settings</h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Basic Info */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Basket Name</label>
              <input
                type="text"
                defaultValue={basket.name}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                rows={3}
                defaultValue={basket.description}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Goal Amount (RWF)</label>
              <input
                type="number"
                defaultValue={basket.goal}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </GlassCard>

        {/* Privacy Settings */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {isPrivate ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            Privacy Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Private Basket</div>
                <div className="text-sm text-gray-400">Only people with the code can join</div>
              </div>
              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  isPrivate ? 'bg-gradient-magenta-orange' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isPrivate ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Anonymous Contributions</div>
                <div className="text-sm text-gray-400">Let members hide their amounts</div>
              </div>
              <button
                onClick={() => setAllowAnonymous(!allowAnonymous)}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  allowAnonymous ? 'bg-gradient-magenta-orange' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  allowAnonymous ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Save Settings */}
        <GradientButton
          variant="primary"
          className="w-full"
          onClick={handleSaveSettings}
        >
          Save Settings
        </GradientButton>

        {/* Danger Zone */}
        <GlassCard className="p-6 border border-red-500/20">
          <h2 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleArchive}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
            >
              <Archive className="w-5 h-5" />
              Archive Basket
            </button>
            
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Delete Basket Permanently
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default BasketSettings;
