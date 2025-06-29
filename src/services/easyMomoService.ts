import { supabase } from '../integrations/supabase/client';

// Types
export interface QRGenerationRequest {
  amount: number;
  phone: string;
  description?: string;
  reference?: string;
}

export interface QRGenerationResult {
  qrCode: string;
  ussdString: string;
  paymentLink: string;
  reference: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  ussdString?: string;
  error?: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  phone: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  ussd_string?: string;
}

// Session management for easy-momo compatibility
const generateSessionId = () => crypto.randomUUID();

// USSD Generation (Compatible with Rwanda mobile money)
const generateUSSDString = (phone: string, amount: number): string => {
  // Rwanda mobile money USSD format
  // MTN: *182*1*1*phone*amount#
  // Airtel: *185*1*phone*amount#
  
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  // Detect operator based on prefix
  if (cleanPhone.startsWith('078') || cleanPhone.startsWith('079')) {
    return `*182*1*1*${cleanPhone}*${amount}#`; // MTN
  } else if (cleanPhone.startsWith('073') || cleanPhone.startsWith('072')) {
    return `*185*1*${cleanPhone}*${amount}#`; // Airtel
  }
  
  // Default to MTN format
  return `*182*1*1*${cleanPhone}*${amount}#`;
};

// QR Code generation - return the data to be encoded
const generateQRCode = async (data: string): Promise<string> => {
  // Return the raw data - the QRCode component will handle the actual generation
  return data;
};

// Phone number validation
const validatePhone = (phone: string): boolean => {
  const rwandaPattern = /^07[2-9]\d{7}$/;
  return rwandaPattern.test(phone.replace(/[^0-9]/g, ''));
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0
  }).format(amount);
};

class EasyMomoService {
  private sessionId: string;

  constructor() {
    this.sessionId = generateSessionId();
  }

  // Generate QR code and payment info
  async generatePaymentQR(request: QRGenerationRequest): Promise<QRGenerationResult> {
    try {
      if (!validatePhone(request.phone)) {
        throw new Error('Invalid phone number format');
      }

      if (request.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const reference = request.reference || `EZM_${Date.now()}`;
      const ussdString = generateUSSDString(request.phone, request.amount);
      
      // Generate QR code with payment data
      const qrData = JSON.stringify({
        type: 'mobile_money_payment',
        phone: request.phone,
        amount: request.amount,
        reference,
        ussd: ussdString,
        description: request.description || 'Easy MoMo Payment'
      });

      const qrCode = await generateQRCode(qrData);
      
      // Create shareable payment link
      const paymentLink = `${window.location.origin}/easy-momo/pay?ref=${reference}&phone=${encodeURIComponent(request.phone)}&amount=${request.amount}`;

      // Save to database
      await this.saveQRHistory({
        reference,
        phone: request.phone,
        amount: request.amount,
        qr_data: qrData,
        ussd_string: ussdString,
        session_id: this.sessionId
      });

      return {
        qrCode,
        ussdString,
        paymentLink,
        reference
      };
    } catch (error) {
      console.error('Failed to generate payment QR:', error);
      throw error;
    }
  }

  // Process scanned QR code
  async processScannedQR(qrData: string): Promise<PaymentResult> {
    try {
      let paymentData;
      
      try {
        paymentData = JSON.parse(qrData);
      } catch {
        // If not JSON, treat as raw USSD string
        if (qrData.includes('*') && qrData.includes('#')) {
          return {
            success: true,
            ussdString: qrData
          };
        }
        throw new Error('Invalid QR code format');
      }

      if (paymentData.type !== 'mobile_money_payment') {
        throw new Error('Not a mobile money payment QR code');
      }

      // Validate payment data
      if (!validatePhone(paymentData.phone) || !paymentData.amount) {
        throw new Error('Invalid payment data in QR code');
      }

      // Save transaction
      const transactionId = await this.createTransaction({
        reference: paymentData.reference,
        phone: paymentData.phone,
        amount: paymentData.amount,
        status: 'pending',
        session_id: this.sessionId
      });

      return {
        success: true,
        transactionId,
        ussdString: paymentData.ussd
      };
    } catch (error) {
      console.error('Failed to process scanned QR:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Dial USSD string
  dialUSSD(ussdString: string): void {
    try {
      // Encode USSD string for tel: URL
      const encodedUSSD = encodeURIComponent(ussdString);
      const telUrl = `tel:${encodedUSSD}`;
      
      // Open dialer
      window.location.href = telUrl;
      
      // Track event
      this.trackEvent('ussd_dialed', { ussd_string: ussdString });
    } catch (error) {
      console.error('Failed to dial USSD:', error);
    }
  }

  // Get payment history
  async getPaymentHistory(): Promise<PaymentHistory[]> {
    try {
      const { data, error } = await supabase
        .from('momo_qr_history')
        .select('*')
        .eq('session_id', this.sessionId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        amount: item.amount,
        phone: item.phone,
        status: item.status || 'pending',
        created_at: item.created_at,
        ussd_string: item.ussd_string
      })) || [];
    } catch (error) {
      console.error('Failed to get payment history:', error);
      return [];
    }
  }

  // Helper methods
  private async saveQRHistory(data: any) {
    try {
      const { error } = await supabase
        .from('momo_qr_history')
        .insert({
          ...data,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.warn('Failed to save QR history to database:', error);
        // Continue without saving - don't throw error
      }
    } catch (error) {
      console.warn('Database connection issue, continuing without persistence:', error);
      // Continue without saving
    }
  }

  private async createTransaction(data: any): Promise<string> {
    try {
      const { data: result, error } = await supabase
        .from('momo_transactions')
        .insert({
          ...data,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.warn('Failed to save transaction to database:', error);
        // Return a temporary ID
        return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      return result.id;
    } catch (error) {
      console.warn('Database connection issue, continuing without persistence:', error);
      // Return a temporary ID
      return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  private async trackEvent(eventType: string, data: any) {
    try {
      await supabase
        .from('momo_events')
        .insert({
          event_type: eventType,
          event_data: data,
          session_id: this.sessionId,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.warn('Failed to track event:', error);
      // Continue without tracking
    }
  }

  // Make utility functions available as instance methods
  validatePhone = validatePhone;
  formatCurrency = formatCurrency;
  generateUSSDString = generateUSSDString;
}

// Create singleton instance
export const easyMomoService = new EasyMomoService();

// Export static utilities separately for direct access
export const easyMomoUtils = {
  validatePhone,
  formatCurrency,
  generateUSSDString
};

export default easyMomoService;
 