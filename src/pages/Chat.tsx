import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  users: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface BasketInfo {
  id: string;
  title: string;
  is_private: boolean;
  creator_id: string;
}

export const Chat = () => {
  const navigate = useNavigate();
  const { id: basketId } = useParams();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch basket info to check access
  const { data: basketInfo, error: basketError } = useQuery({
    queryKey: ['basket-info', basketId],
    queryFn: async () => {
      if (!basketId) throw new Error('No basket ID provided');

      const { data, error } = await supabase
        .from('baskets')
        .select('id, title, is_private, creator_id')
        .eq('id', basketId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Basket not found');

      // Check if user has access to this basket
      if (data.is_private) {
        const { data: membership, error: memberError } = await supabase
          .from('basket_members')
          .select('id')
          .eq('basket_id', basketId)
          .eq('user_id', user?.id)
          .single();

        if (memberError || !membership) {
          throw new Error('Access denied: You are not a member of this private basket');
        }
      }

      return data as BasketInfo;
    },
    enabled: !!basketId && !!user?.id,
    retry: 1
  });

  // Fetch messages
  const { data: messages = [], isLoading, error, refetch } = useQuery({
    queryKey: ['messages', basketId],
    queryFn: async () => {
      if (!basketId) throw new Error('No basket ID provided');

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          user_id,
          created_at,
          users(display_name, avatar_url)
        `)
        .eq('basket_id', basketId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      return (data || []) as Message[];
    },
    enabled: !!basketId && !!basketInfo,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time effect
    retry: 1
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!basketId || !user?.id) throw new Error('Missing required data');

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            basket_id: basketId,
            user_id: user.id,
            content: content.trim()
          }
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', basketId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set up real-time subscription
  useEffect(() => {
    if (!basketId) return;

    const subscription = supabase
      .channel(`messages:basket:${basketId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `basket_id=eq.${basketId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', basketId] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [basketId, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate(newMessage);
  };

  const handleRetry = () => {
    refetch();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getMessageAlignment = (message: Message) => {
    return message.user_id === user?.id ? 'flex-row-reverse' : 'flex-row';
  };

  const getMessageStyle = (message: Message) => {
    return message.user_id === user?.id
      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white ml-12'
      : 'bg-white/10 text-white mr-12';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
              <Skeleton className="h-16 w-3/4 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || basketError || !basketInfo) {
    const errorMessage = (error || basketError) instanceof Error 
      ? (error || basketError)?.message 
      : 'Something went wrong';
    const isAccessDenied = errorMessage.includes('Access denied');
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isAccessDenied ? 'Access Denied' : 'Chat Unavailable'}
          </h3>
          <p className="text-gray-400 mb-6">
            {isAccessDenied 
              ? 'You need to be a member to access this chat'
              : errorMessage
            }
          </p>
          <div className="space-y-3">
            {!isAccessDenied && (
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </button>
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-lg gradient-text">{basketInfo.title}</h1>
            <p className="text-sm text-gray-400">
              {messages.length} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No messages yet</h3>
            <p className="text-gray-400">Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${getMessageAlignment(message)}`}>
              <div className={`p-3 rounded-xl max-w-xs ${getMessageStyle(message)}`}>
                <div className="font-medium text-sm mb-1">
                  {message.users?.display_name || 'Anonymous'}
                </div>
                <div className="text-sm leading-relaxed">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 bg-background/80 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            disabled={sendMessageMutation.isPending}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        {newMessage.length > 450 && (
          <div className="text-xs text-gray-400 mt-1 text-right">
            {500 - newMessage.length} characters remaining
          </div>
        )}
      </div>
    </div>
  );
};
