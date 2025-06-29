import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Lock, Unlock, Archive, Trash2, AlertCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface BasketSettings {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  is_private: boolean;
  creator_id: string;
  allow_anonymous: boolean;
  currency: string;
  country: string;
  category: string;
  duration_days: number;
}

export const BasketSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: 0,
    is_private: false,
    allow_anonymous: true
  });

  // Fetch basket settings
  const { data: basketSettings, isLoading, error, refetch } = useQuery({
    queryKey: ['basket-settings', id],
    queryFn: async () => {
      if (!id) throw new Error('No basket ID provided');

      const { data, error } = await supabase
        .from('baskets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Basket not found');

      // Check if current user is the creator
      if (data.creator_id !== user?.id) {
        throw new Error('Access denied: Only the basket creator can access settings');
      }

      return data as BasketSettings;
    },
    enabled: !!id && !!user?.id,
    retry: 1
  });

  // Update form data when basket settings are loaded
  useEffect(() => {
    if (basketSettings) {
      setFormData({
        title: basketSettings.title,
        description: basketSettings.description || '',
        goal_amount: basketSettings.goal_amount,
        is_private: basketSettings.is_private,
        allow_anonymous: basketSettings.allow_anonymous ?? true
      });
    }
  }, [basketSettings]);

  // Update basket mutation
  const updateBasketMutation = useMutation({
    mutationFn: async (updates: Partial<BasketSettings>) => {
      if (!id) throw new Error('No basket ID');
      
      const { error } = await supabase
        .from('baskets')
        .update(updates)
        .eq('id', id)
        .eq('creator_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your basket settings have been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['basket', id] });
      queryClient.invalidateQueries({ queryKey: ['basket-settings', id] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Archive basket mutation
  const archiveBasketMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('No basket ID');
      
      const { error } = await supabase
        .from('baskets')
        .update({ status: 'archived' })
        .eq('id', id)
        .eq('creator_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Basket Archived",
        description: "Your basket has been archived and is no longer active",
      });
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      navigate('/baskets/mine');
    },
    onError: (error: any) => {
      toast({
        title: "Archive Failed",
        description: error.message || "Failed to archive basket",
        variant: "destructive"
      });
    }
  });

  // Delete basket mutation
  const deleteBasketMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('No basket ID');
      
      // First delete related data (contributions, members)
      await supabase.from('contributions').delete().eq('basket_id', id);
      await supabase.from('basket_members').delete().eq('basket_id', id);
      
      // Then delete the basket
      const { error } = await supabase
        .from('baskets')
        .delete()
        .eq('id', id)
        .eq('creator_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Basket Deleted",
        description: "Your basket has been permanently deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['baskets'] });
      navigate('/baskets/mine');
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete basket",
        variant: "destructive"
      });
    }
  });

  const handleSaveSettings = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Basket name is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.goal_amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Goal amount must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    updateBasketMutation.mutate({
      title: formData.title.trim(),
      description: formData.description.trim(),
      goal_amount: formData.goal_amount,
      is_private: formData.is_private,
      allow_anonymous: formData.allow_anonymous
    });
  };

  const handleArchive = () => {
    if (window.confirm('Are you sure you want to archive this basket? It will no longer be active but can be restored later.')) {
      archiveBasketMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this basket? This action cannot be undone and all contributions will be lost.')) {
      deleteBasketMutation.mutate();
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRetry = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="w-8 h-8 rounded-lg mr-4" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <div className="px-6 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !basketSettings) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    const isAccessDenied = errorMessage.includes('Access denied');
    
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">
            {isAccessDenied ? 'Access Denied' : 'Settings Not Found'}
          </h2>
          <p className="text-gray-400 mb-6">
            {isAccessDenied 
              ? 'Only the basket creator can access settings'
              : errorMessage
            }
          </p>
          <div className="space-y-3">
            {!isAccessDenied && (
              <GradientButton onClick={handleRetry} className="w-full">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </GradientButton>
            )}
            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
            >
              Go Back
            </button>
          </div>
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
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter basket name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                placeholder="Describe your basket goal..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Goal Amount ({basketSettings.currency})
              </label>
              <input
                type="number"
                value={formData.goal_amount}
                onChange={(e) => handleInputChange('goal_amount', Number(e.target.value))}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                min="1"
              />
            </div>
          </div>
        </GlassCard>

        {/* Privacy Settings */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {formData.is_private ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            Privacy Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Private Basket</div>
                <div className="text-sm text-gray-400">Only people with the link can join</div>
              </div>
              <button
                onClick={() => handleInputChange('is_private', !formData.is_private)}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  formData.is_private ? 'bg-gradient-magenta-orange' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.is_private ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Allow Anonymous Contributions</div>
                <div className="text-sm text-gray-400">Let members hide their contribution amounts</div>
              </div>
              <button
                onClick={() => handleInputChange('allow_anonymous', !formData.allow_anonymous)}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  formData.allow_anonymous ? 'bg-gradient-magenta-orange' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.allow_anonymous ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Basket Info */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4">Basket Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Country:</span>
              <div className="font-medium">{basketSettings.country}</div>
            </div>
            <div>
              <span className="text-gray-400">Currency:</span>
              <div className="font-medium">{basketSettings.currency}</div>
            </div>
            <div>
              <span className="text-gray-400">Category:</span>
              <div className="font-medium">{basketSettings.category}</div>
            </div>
            <div>
              <span className="text-gray-400">Duration:</span>
              <div className="font-medium">{basketSettings.duration_days} days</div>
            </div>
          </div>
        </GlassCard>

        {/* Save Settings */}
        <GradientButton
          variant="primary"
          className="w-full"
          onClick={handleSaveSettings}
          loading={updateBasketMutation.isPending}
          disabled={updateBasketMutation.isPending}
        >
          {updateBasketMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </GradientButton>

        {/* Danger Zone */}
        <GlassCard className="p-6 border border-red-500/20">
          <h2 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleArchive}
              disabled={archiveBasketMutation.isPending}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
            >
              {archiveBasketMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Archive className="w-5 h-5" />
              )}
              {archiveBasketMutation.isPending ? 'Archiving...' : 'Archive Basket'}
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleteBasketMutation.isPending}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              {deleteBasketMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              {deleteBasketMutation.isPending ? 'Deleting...' : 'Delete Basket Permanently'}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
