import React, { useState } from 'react';
import { ArrowLeft, Share2, Download, Copy, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from 'react-qr-code';
import easyMomoService, { QRGenerationRequest, easyMomoUtils } from '@/services/easyMomoService';

const GetPaidScreen = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrResult, setQrResult] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const validatePhone = (phone: string) => {
    return easyMomoUtils.validatePhone(phone);
  };

  const validateAmount = (amount: string) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handleGenerateQR = async () => {
    if (!validatePhone(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Rwanda phone number (e.g., 0781234567)",
        variant: "destructive"
      });
      return;
    }

    if (!validateAmount(amount)) {
      toast({
        title: "Invalid Amount", 
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const request: QRGenerationRequest = {
        phone,
        amount: parseInt(amount),
        description: description || 'Payment Request'
      };

      const result = await easyMomoService.generatePaymentQR(request);
      setQrResult(result);
      setShowQRModal(true);
      
      toast({
        title: "QR Code Generated",
        description: "Payment QR code is ready to share!"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate QR code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async (method: string) => {
    if (!qrResult) return;

    const shareText = `Pay ${easyMomoUtils.formatCurrency(parseInt(amount))} to ${phone}\n\nClick to pay: ${qrResult.paymentLink}\n\nOr dial: ${qrResult.ussdString}`;

    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(shareText);
        toast({ title: "Copied", description: "Payment details copied to clipboard" });
        break;
      case 'download':
        // Create download link for QR code
        const link = document.createElement('a');
        link.download = `payment-qr-${phone}.png`;
        link.href = qrResult.qrCode;
        link.click();
        break;
    }
  };

  const dialUSSD = () => {
    if (qrResult?.ussdString) {
      easyMomoService.dialUSSD(qrResult.ussdString);
    }
  };

  const copyUSSD = async () => {
    if (qrResult?.ussdString) {
      await navigator.clipboard.writeText(qrResult.ussdString);
      toast({ title: "Copied", description: "USSD code copied to clipboard" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-teal-900 dark:to-green-900 p-4">
      <div className="max-w-md mx-auto pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate('/easy-momo')}
            variant="outline"
            size="icon"
            className="glass-card backdrop-blur-md border-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Get Paid
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Payment Form */}
        <Card className="glass-card backdrop-blur-md border-0 shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-center text-gray-800 dark:text-gray-200">
              Create Payment Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="078XXXXXXX"
                value={phone}
                onChange={handlePhoneChange}
                className={`mt-1 ${!validatePhone(phone) && phone ? 'border-red-500' : ''}`}
                maxLength={10}
              />
              {phone && !validatePhone(phone) && (
                <p className="text-sm text-red-500 mt-1">
                  Enter a valid Rwanda phone number
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Amount (RWF)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={amount}
                onChange={handleAmountChange}
                className={`mt-1 ${!validateAmount(amount) && amount ? 'border-red-500' : ''}`}
              />
              {amount && !validateAmount(amount) && (
                <p className="text-sm text-red-500 mt-1">
                  Enter a valid amount greater than 0
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                type="text"
                placeholder="Payment for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                maxLength={50}
              />
            </div>

            <Button
              onClick={handleGenerateQR}
              disabled={isGenerating || !validatePhone(phone) || !validateAmount(amount)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-6 rounded-2xl text-lg font-semibold transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? 'Generating...' : 'Generate QR Code'}
            </Button>
          </CardContent>
        </Card>

        {/* Share Options */}
        {qrResult && (
          <Card className="glass-card backdrop-blur-md border-0 shadow-lg">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                Share Payment Request
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleShare('whatsapp')}
                  variant="outline"
                  className="flex-col h-16 space-y-1 bg-green-50 hover:bg-green-100 border-green-200"
                >
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                  </svg>
                  <span className="text-xs">WhatsApp</span>
                </Button>

                <Button
                  onClick={() => handleShare('copy')}
                  variant="outline"
                  className="flex-col h-16 space-y-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
                >
                  <Copy className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Copy</span>
                </Button>

                <Button
                  onClick={() => handleShare('sms')}
                  variant="outline"
                  className="flex-col h-16 space-y-1 bg-purple-50 hover:bg-purple-100 border-purple-200"
                >
                  <Phone className="w-5 h-5 text-purple-600" />
                  <span className="text-xs">SMS</span>
                </Button>

                <Button
                  onClick={() => handleShare('download')}
                  variant="outline"
                  className="flex-col h-16 space-y-1 bg-orange-50 hover:bg-orange-100 border-orange-200"
                >
                  <Download className="w-5 h-5 text-orange-600" />
                  <span className="text-xs">Download</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Payment QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 p-4">
            {qrResult && (
              <>
                {/* QR Code with white background */}
                <div className="qr-wrapper flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-lg">
                  <QRCode 
                    value={qrResult.ussdString} 
                    size={200} 
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="font-semibold text-lg">
                    {easyMomoUtils.formatCurrency(parseInt(amount))}
                  </p>
                  <p className="text-sm text-gray-600">to {phone}</p>
                  
                  {/* USSD Code with Copy Button */}
                  <div className="flex items-center justify-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <span className="text-xs text-gray-700 font-mono">{qrResult.ussdString}</span>
                    <Copy
                      size={14}
                      className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={copyUSSD}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 w-full">
                  <Button
                    onClick={dialUSSD}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Dial USSD
                  </Button>
                  <Button
                    onClick={() => setShowQRModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetPaidScreen;
