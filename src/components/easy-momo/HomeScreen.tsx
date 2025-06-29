import React, { useState } from 'react';
import { QrCode, Link, Clock, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Easy MoMo - Mobile Money Made Easy',
          text: 'Check out Easy MoMo - the easiest way to send and receive mobile money payments in Rwanda! 🇷🇼💰',
          url: window.location.origin + '/easy-momo'
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin + '/easy-momo');
        toast({
          title: "Link Copied",
          description: "Easy MoMo link copied to clipboard"
        });
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const openWhatsApp = () => {
    const shareText = encodeURIComponent(
      "Check out Easy MoMo - the easiest way to send and receive mobile money payments in Rwanda! 🇷🇼💰\n\n" +
      window.location.origin + "/easy-momo"
    );
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            easyMO
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            Mobile Money Made Easy
          </p>
        </div>

        {/* Main Actions */}
        <Card className="glass-card backdrop-blur-md border-0 shadow-2xl mb-6">
          <CardContent className="p-6 space-y-4">
            <Button 
              onClick={() => navigate("/easy-momo/pay")} 
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-2xl text-lg transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <QrCode className="w-6 h-6 mr-3" />
              Scan & Pay
            </Button>
            
            <Button 
              onClick={() => navigate("/easy-momo/get-paid")} 
              className="w-full bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 hover:from-green-500 hover:via-teal-600 hover:to-blue-600 text-white font-semibold py-6 rounded-2xl text-lg transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Link className="w-6 h-6 mr-3" />
              Get Paid
            </Button>
          </CardContent>
        </Card>

        {/* Secondary Actions */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={handleShare}
            variant="outline"
            size="lg"
            className="flex-1 glass-card backdrop-blur-md border-0 hover:scale-110 transition-transform duration-200"
            disabled={isSharing}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share App
          </Button>
          
          <Button
            onClick={() => navigate("/easy-momo/history")}
            variant="outline"
            size="lg"
            className="flex-1 glass-card backdrop-blur-md border-0 hover:scale-110 transition-transform duration-200"
          >
            <Clock className="w-5 h-5 mr-2" />
            History
          </Button>
        </div>

        {/* WhatsApp Channel */}
        <Card className="glass-card backdrop-blur-md border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Join our WhatsApp Channel
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get updates and support
                </p>
              </div>
              <Button
                onClick={openWhatsApp}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;
