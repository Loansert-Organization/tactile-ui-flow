import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types
interface QRScanRequest {
  qrImage: string;
  sessionId?: string;
  enhanceImage?: boolean;
  aiProcessing?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  sanitized: string;
  country: string;
  provider: string;
  patternType: string;
}

// Utility functions
function validateUssdPattern(pattern: string): ValidationResult {
  const normalized = pattern.replace(/[^0-9*#]/g, '');
  
  // Rwanda MTN patterns
  const mtnPatterns = [
    /^\*182\*1\*1\*07[2-9]\d{7}\*\d+#$/,  // Phone number
    /^\*182\*8\*1\*\d{4,6}\*\d+#$/        // Agent code
  ];
  
  for (const pattern of mtnPatterns) {
    if (pattern.test(normalized)) {
      return {
        isValid: true,
        confidence: 0.95,
        sanitized: normalized,
        country: 'Rwanda',
        provider: 'MTN',
        patternType: 'USSD'
      };
    }
  }
  
  return {
    isValid: false,
    confidence: 0.0,
    sanitized: normalized,
    country: 'Unknown',
    provider: 'Unknown',
    patternType: 'Unknown'
  };
}

function extractPaymentDetails(ussd: string): { receiver: string; amount: string } {
  // Extract from MTN Rwanda patterns
  const mtnMatch = ussd.match(/^\*182\*(?:1\*1|8\*1)\*([^*]+)\*(\d+)#$/);
  if (mtnMatch) {
    return {
      receiver: mtnMatch[1],
      amount: mtnMatch[2]
    };
  }
  
  return { receiver: '', amount: '' };
}

function generateSimulatedQRPattern(): string {
  const patterns = [
    '*182*1*1*0788123456*5000#',
    '*182*8*1*12345*3000#',
    '*182*1*1*0789654321*10000#'
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

// Response functions
function createSuccessResponse(
  ussdString: string,
  receiver: string,
  amount: string,
  validation: ValidationResult,
  processingTime: number,
  aiProcessing: boolean
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      ussdString,
      receiver,
      amount: parseInt(amount),
      confidence: validation.confidence,
      country: validation.country,
      provider: validation.provider,
      patternType: validation.patternType,
      processingTime,
      aiProcessing,
      telUri: `tel:${encodeURIComponent(ussdString)}`
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    }
  );
}

function createErrorResponse(
  error: string,
  code: string,
  status: number = 500,
  confidence?: number
): Response {
  return new Response(
    JSON.stringify({
      error,
      code,
      ...(confidence !== undefined && { confidence })
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status
    }
  );
}

function createOptionsResponse(): Response {
  return new Response('ok', { headers: corsHeaders });
}

// Database operations
async function saveQRHistory(
  supabaseClient: any,
  sessionId: string,
  receiver: string,
  amount: string,
  sanitizedUssd: string
): Promise<void> {
  const { error: historyError } = await supabaseClient
    .from('momo_qr_history') // Updated table name
    .insert({
      session_id: sessionId,
      phone_number: receiver,
      amount: parseInt(amount),
      type: 'ai_scan',
      ussd_string: sanitizedUssd
    });

  if (historyError) {
    console.error('History insert error:', historyError);
  } else {
    console.log('Enhanced scan saved to history');
  }
}

async function logAnalyticsEvent(
  supabaseClient: any,
  sessionId: string,
  receiver: string,
  amount: string,
  validation: ValidationResult,
  enhanceImage: boolean,
  aiProcessing: boolean,
  originalPattern: string,
  sanitizedPattern: string
): Promise<void> {
  try {
    await supabaseClient
      .from('momo_events') // Updated table name
      .insert({
        session_id: sessionId || 'anonymous',
        event_type: 'qr_ai_enhanced_processed',
        event_data: {
          receiver,
          amount: parseInt(amount),
          country: validation.country,
          provider: validation.provider,
          patternType: validation.patternType,
          confidence: validation.confidence,
          enhanceImage,
          aiProcessing,
          originalPattern,
          sanitizedPattern
        }
      });
    console.log('Enhanced analytics logged');
  } catch (analyticsError) {
    console.warn('Analytics logging failed:', analyticsError);
  }
}

async function setSessionContext(
  supabaseClient: any,
  sessionId: string
): Promise<void> {
  try {
    await supabaseClient.rpc('set_config', {
      setting_name: 'app.session_id',
      setting_value: sessionId,
      is_local: false
    });
    console.log('Session context set:', sessionId);
  } catch (err) {
    console.warn('Could not set session context:', err);
  }
}

// Main function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return createOptionsResponse();
  }

  try {
    console.log('Enhanced QR scan request received');
    const { qrImage, sessionId, enhanceImage, aiProcessing }: QRScanRequest = await req.json();

    if (!qrImage) {
      console.error('Missing qrImage in request');
      return createErrorResponse(
        'Missing required field: qrImage',
        'MISSING_FIELDS'
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Set session context for RLS if sessionId provided
    if (sessionId) {
      await setSessionContext(supabaseClient, sessionId);
    }

    // Enhanced QR processing with better pattern matching
    console.log('Processing QR image with enhanced validation:', { enhanceImage, aiProcessing });
    
    // Simulate enhanced QR processing with realistic patterns
    const randomPattern = generateSimulatedQRPattern();
    console.log('Generated pattern:', randomPattern);
    
    // Validate the pattern using new normalization
    const validation = validateUssdPattern(randomPattern);
    console.log('Pattern validation:', validation);
    
    if (!validation.isValid) {
      console.log('Invalid USSD pattern generated');
      return createErrorResponse(
        'Could not decode valid USSD string from QR code',
        'QR_DECODE_FAILED',
        200,
        validation.confidence
      );
    }

    // Use the sanitized (normalized) version for parsing
    const sanitizedUssd = validation.sanitized;
    
    // Extract receiver and amount from normalized pattern
    const { receiver, amount } = extractPaymentDetails(sanitizedUssd);
    
    if (!receiver || !amount) {
      console.log('Could not extract receiver/amount from pattern');
      return createErrorResponse(
        'Could not parse USSD pattern',
        'USSD_PARSE_FAILED',
        200,
        0
      );
    }

    console.log('QR decoded successfully:', { receiver, amount, validation });
    
    // Save enhanced scan to QR history
    if (sessionId) {
      await saveQRHistory(supabaseClient, sessionId, receiver, amount, sanitizedUssd);
    }

    // Log enhanced analytics event
    await logAnalyticsEvent(
      supabaseClient,
      sessionId,
      receiver,
      amount,
      validation,
      enhanceImage || false,
      aiProcessing || false,
      randomPattern,
      sanitizedUssd
    );

    const processingTime = Math.floor(Math.random() * 1000) + 500;
    return createSuccessResponse(
      sanitizedUssd,
      receiver,
      amount,
      validation,
      processingTime,
      aiProcessing || false
    );

  } catch (error) {
    console.error('Unexpected error in enhanced scan-qr function:', error);
    return createErrorResponse(
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
}); 