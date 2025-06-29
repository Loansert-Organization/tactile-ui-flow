import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// QR Code Generation Utility
async function generateQRCodeDataURL(text: string): Promise<string> {
  try {
    // Use a faster QR code generation API with optimized parameters
    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&format=png&margin=1&color=1f2937&bgcolor=ffffff&ecc=M`);
    
    if (!response.ok) {
      throw new Error('QR code generation failed');
    }

    const qrImageBlob = await response.blob();
    const arrayBuffer = await qrImageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('QR generation error:', error);
    // Fallback: create a simple SVG with text
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="white"/>
      <text x="150" y="150" text-anchor="middle" font-family="monospace" font-size="10" fill="black">${text}</text>
    </svg>`;
    const base64 = btoa(svgContent);
    return `data:image/svg+xml;base64,${base64}`;
  }
}

// Validation functions
function validateInput(receiver: string, amount: string, sessionId: string) {
  if (!receiver || !amount || !sessionId) {
    return {
      isValid: false,
      errorResponse: new Response(
        JSON.stringify({ 
          error: 'Missing required fields: receiver, amount, sessionId',
          code: 'MISSING_FIELDS'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    };
  }
  return { isValid: true };
}

function createErrorResponse(error: string, code: string, details?: string, status: number = 500): Response {
  return new Response(
    JSON.stringify({ 
      error,
      code,
      ...(details && { details })
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  );
}

function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify(data),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

// Database operations
async function generateUSSDAndMethod(supabaseClient: any, receiver: string, amount: number) {
  const [ussdData, methodData] = await Promise.all([
    supabaseClient.rpc('generate_ussd_string', { input_value: receiver, amount }),
    supabaseClient.rpc('detect_payment_method', { input_value: receiver })
  ]);
  return { ussdData, methodData };
}

async function executeBackgroundOperations(
  supabaseClient: any,
  sessionId: string,
  receiver: string,
  amount: number,
  ussdString: string,
  qrCodeDataURL: string,
  methodData: string
): Promise<void> {
  // Execute all background operations in parallel
  Promise.all([
    // Upload to storage
    (async () => {
      try {
        const base64Data = qrCodeDataURL.split(',')[1];
        const qrCodeBlob = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `${sessionId}/${Date.now()}.png`;
        
        const { error: uploadError } = await supabaseClient.storage
          .from('momo-qr-codes')
          .upload(fileName, qrCodeBlob, { contentType: 'image/png' });

        if (uploadError) {
          console.warn('Storage upload failed:', uploadError);
        }
      } catch (error) {
        console.warn('Storage operation failed:', error);
      }
    })(),
    
    // Save to payments table (updated table name)
    (async () => {
      try {
        await supabaseClient
          .from('momo_payments')
          .insert({
            session_id: sessionId,
            phone_number: receiver,
            momo_code: methodData === 'code' ? receiver : null,
            amount,
            method: methodData,
            ussd_string: ussdString,
            status: 'pending'
          });
      } catch (error) {
        console.warn('Payment insert failed:', error);
      }
    })(),
    
    // Save to QR history (updated table name)
    (async () => {
      try {
        await supabaseClient
          .from('momo_qr_history')
          .insert({
            session_id: sessionId,
            phone_number: receiver,
            amount,
            type: 'generate',
            ussd_string: ussdString,
            qr_image_url: qrCodeDataURL
          });
      } catch (error) {
        console.warn('History insert failed:', error);
      }
    })(),
    
    // Log analytics (updated table name)
    (async () => {
      try {
        await supabaseClient
          .from('momo_events')
          .insert({
            session_id: sessionId,
            event_type: 'qr_generated',
            event_data: {
              receiver,
              amount,
              method: methodData
            }
          });
      } catch (error) {
        console.warn('Analytics logging failed:', error);
      }
    })()
  ]);
}

// Main function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { receiver, amount, sessionId } = await req.json();

    // Validate input
    const validation = validateInput(receiver, amount, sessionId);
    if (!validation.isValid) {
      return validation.errorResponse!;
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate USSD and detect payment method
    const { ussdData, methodData } = await generateUSSDAndMethod(
      supabaseClient,
      receiver,
      parseInt(amount)
    );

    // Handle USSD generation error
    if (ussdData.error) {
      console.error('USSD generation error:', ussdData.error);
      return createErrorResponse(
        'Failed to generate USSD string',
        'USSD_GENERATION_FAILED',
        ussdData.error.message
      );
    }

    // Handle method detection error
    if (methodData.error) {
      console.error('Method detection error:', methodData.error);
      return createErrorResponse(
        'Failed to detect payment method',
        'METHOD_DETECTION_FAILED',
        methodData.error.message
      );
    }

    const ussdString = ussdData.data;
    const telUri = `tel:${encodeURIComponent(ussdString)}`;
    console.log('Generated tel URI:', telUri);

    // Generate QR code
    const qrCodeDataURL = await generateQRCodeDataURL(telUri);

    // Execute background operations (don't await to speed up response)
    executeBackgroundOperations(
      supabaseClient,
      sessionId,
      receiver,
      parseInt(amount),
      ussdString,
      qrCodeDataURL,
      methodData.data
    );

    // Return immediate response with QR data
    return createSuccessResponse({
      qrCodeImage: qrCodeDataURL,
      qrCodeUrl: qrCodeDataURL,
      ussdString,
      telUri,
      paymentId: null
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse(
      'Internal server error',
      'INTERNAL_ERROR',
      error.message
    );
  }
}); 