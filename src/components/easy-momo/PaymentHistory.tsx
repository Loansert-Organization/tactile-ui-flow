import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import easyMomoService, { PaymentHistory as PaymentHistoryType, easyMomoUtils } from '@/services/easyMomoService';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PaymentHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await easyMomoService.getPaymentHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const dialUSSD = (ussdString: string) => {
    easyMomoService.dialUSSD(ussdString);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
        <div className="max-w-md mx-auto pt-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
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
            Payment History
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <Card className="glass-card backdrop-blur-md border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                No Payment History
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your payment history will appear here once you start using Easy MoMo.
              </p>
              <Button
                onClick={() => navigate('/easy-momo/get-paid')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Create Payment Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((payment) => (
              <Card key={payment.id} className="glass-card backdrop-blur-md border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(payment.status)}
                        <Badge variant="secondary" className={getStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                          {easyMomoUtils.formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          to {payment.phone}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {payment.ussd_string && (
                        <Button
                          onClick={() => dialUSSD(payment.ussd_string!)}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Dial
                        </Button>
                      )}
                    </div>
                  </div>

                  {payment.ussd_string && (
                    <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">USSD Code:</p>
                      <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
                        {payment.ussd_string}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Load More Button (if needed) */}
            {history.length >= 50 && (
              <Card className="glass-card backdrop-blur-md border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Button
                    onClick={loadHistory}
                    variant="outline"
                    className="w-full"
                  >
                    Load More
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
