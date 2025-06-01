
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Share2, Settings, Send, Eye, EyeOff, Copy } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useSwipeGesture, useLongPress, usePressFeedback } from '@/hooks/useInteractions';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';

interface Message {
  id: string;
  userCode: string;
  amount: number;
  isHidden: boolean;
  timestamp: Date;
  type: 'contribution' | 'system';
}

const dummyMessages: Message[] = [
  { id: '1', userCode: '123456', amount: 50000, isHidden: false, timestamp: new Date(Date.now() - 3600000), type: 'contribution' },
  { id: '2', userCode: '234567', amount: 25000, isHidden: true, timestamp: new Date(Date.now() - 3000000), type: 'contribution' },
  { id: '3', userCode: '345678', amount: 100000, isHidden: false, timestamp: new Date(Date.now() - 2400000), type: 'contribution' },
  { id: '4', userCode: '456789', amount: 75000, isHidden: true, timestamp: new Date(Date.now() - 1800000), type: 'contribution' },
  { id: '5', userCode: '567890', amount: 30000, isHidden: false, timestamp: new Date(Date.now() - 1200000), type: 'contribution' },
  { id: '6', userCode: '678901', amount: 60000, isHidden: true, timestamp: new Date(Date.now() - 900000), type: 'contribution' },
  { id: '7', userCode: '789012', amount: 45000, isHidden: false, timestamp: new Date(Date.now() - 600000), type: 'contribution' },
  { id: '8', userCode: '890123', amount: 85000, isHidden: true, timestamp: new Date(Date.now() - 300000), type: 'contribution' },
  { id: '9', userCode: '901234', amount: 40000, isHidden: false, timestamp: new Date(Date.now() - 180000), type: 'contribution' },
  { id: '10', userCode: '012345', amount: 95000, isHidden: false, timestamp: new Date(Date.now() - 60000), type: 'contribution' },
];

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [currentTotal, setCurrentTotal] = useState(560000);
  const [goal] = useState(1000000);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handlePress } = usePressFeedback();

  const progress = (currentTotal / goal) * 100;

  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(
    () => console.log('Swipe left - open menu'),
    () => console.log('Swipe right - go back')
  );

  const handleLongPressMessage = (messageId: string, event: React.MouseEvent) => {
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowContextMenu(messageId);
  };

  const longPressProps = (messageId: string) => useLongPress(
    () => console.log('Long press detected for message:', messageId),
    500
  );

  const toggleMessageVisibility = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isHidden: !msg.isHidden } : msg
    ));
    setShowContextMenu(null);
  };

  const copyUserCode = (userCode: string) => {
    navigator.clipboard.writeText(userCode);
    toast({ title: "Copied!", description: `User code ${userCode} copied to clipboard` });
    setShowContextMenu(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div 
      className="flex flex-col h-[calc(100vh-140px)]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <GlassCard className="m-4 mb-0 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Arsenal Season Tickets</h1>
            <p className="text-sm text-gray-400">12 contributors</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm font-semibold gradient-text-blue">
                  {formatCurrency(currentTotal)}
                </div>
                <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-green-400 animate-pulse' : 'bg-blue-400'}`} />
              </div>
              <div className="text-xs text-gray-400">
                of {formatCurrency(goal)}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePress}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Share basket"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handlePress}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Basket settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="animate-slide-up group"
            {...longPressProps(message.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleLongPressMessage(message.id, e);
            }}
          >
            <GlassCard 
              className={`p-4 transition-all duration-300 cursor-pointer ${
                message.isHidden 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-gradient-teal-blue/20 border-cyan-400/30 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-purple-pink flex items-center justify-center text-xs font-bold">
                    {message.userCode.slice(-2)}
                  </div>
                  <div>
                    <span className="text-sm text-gray-300">User {message.userCode}</span>
                    <div className="text-xs text-gray-500">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {message.isHidden ? (
                    <span className="text-gray-400 font-mono">●●●●●●</span>
                  ) : (
                    <span className="font-semibold gradient-text-blue">
                      +{formatCurrency(message.amount)}
                    </span>
                  )}
                  {message.isHidden ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="fixed z-50 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-2 shadow-xl"
          style={{ 
            left: contextMenuPosition.x, 
            top: contextMenuPosition.y,
            transform: 'translate(-50%, -100%)' 
          }}
        >
          <button
            onClick={() => {
              const message = messages.find(m => m.id === showContextMenu);
              if (message) copyUserCode(message.userCode);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10 rounded"
          >
            <Copy className="w-4 h-4" />
            Copy Code
          </button>
          <button
            onClick={() => toggleMessageVisibility(showContextMenu)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10 rounded"
          >
            {messages.find(m => m.id === showContextMenu)?.isHidden ? (
              <>
                <Eye className="w-4 h-4" />
                Show Amount
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Amount
              </>
            )}
          </button>
        </div>
      )}

      {/* Overlay to close context menu */}
      {showContextMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowContextMenu(null)}
        />
      )}

      {/* Footer */}
      <GlassCard className="m-4 mt-0 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePress}
            className="p-3 rounded-full bg-gradient-magenta-orange shadow-lg hover:shadow-xl transition-all duration-200 animate-jiggle"
            aria-label="Add contribution"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex-1 bg-white/5 rounded-lg px-4 py-3 text-gray-500">
            Chat is disabled for this basket
          </div>
          
          <button
            disabled
            className="p-3 rounded-lg bg-gray-600/20 text-gray-500 cursor-not-allowed"
            aria-label="Send message (disabled)"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
