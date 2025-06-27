
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, User, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PayScreen = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleGenerateQR = () => {
    if (!amount || !recipient) return;
    
    const paymentData = {
      amount: parseFloat(amount),
      recipient,
      message,
      timestamp: new Date().toISOString()
    };
    
    navigate('/qr-preview', { state: paymentData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Make Payment</h1>
        </div>

        {/* Payment Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount (RWF)
              </Label>
              <Input
                id="amount"
                type="text"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-lg font-medium"
              />
            </div>

            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipient" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Recipient
              </Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient name or phone"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Message (Optional)
              </Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Payment description"
              />
            </div>

            {/* Generate QR Button */}
            <Button
              onClick={handleGenerateQR}
              disabled={!amount || !recipient}
              className="w-full mt-6"
              size="lg"
            >
              Generate QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
