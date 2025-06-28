import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageCircle, User } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const LoginOptions = () => {
  const navigate = useNavigate();
  const { signInAnonymous, signInGoogle } = useAuthContext();

  const handleGoogleLogin = async () => {
    try {
      await signInGoogle();
    } catch (error) {
      console.error('Google login exception:', error);
      toast.error('Failed to login with Google');
    }
  };

  const handleEmailLogin = () => {
    navigate('/auth/email');
  };

  const handleWhatsAppLogin = () => {
    navigate('/auth/whatsapp');
  };

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymous();
      navigate('/');
      toast.success('Welcome! You can now use the app anonymously.');
    } catch (error) {
      console.error('Anonymous login error:', error);
      toast.error('Failed to continue as guest');
    }
  };

  const handleSkipLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Choose Your Login Method
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to sync your data across devices
          </p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          <GradientButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </GradientButton>

          <GradientButton
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleEmailLogin}
          >
            <Mail className="w-5 h-5" />
            Continue with Email
          </GradientButton>

          <GradientButton
            variant="accent"
            size="lg"
            className="w-full"
            onClick={handleWhatsAppLogin}
          >
            <MessageCircle className="w-5 h-5" />
            Continue with WhatsApp
          </GradientButton>

          <GradientButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleAnonymousLogin}
          >
            <User className="w-5 h-5" />
            Continue as Guest
          </GradientButton>
        </div>

        {/* Skip Option */}
        <div className="text-center pt-6">
          <Button
            variant="ghost"
            onClick={handleSkipLogin}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Continue without signing in
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginOptions;
