import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId, eventType, eventData } = await req.json()

    if (!sessionId || !eventType) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: sessionId, eventType',
          code: 'MISSING_FIELDS'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Set session context for RLS
    try {
      await supabaseClient.rpc('set_config', {
        setting_name: 'app.session_id',
        setting_value: sessionId,
        is_local: false
      })
    } catch (err) {
      console.warn('Could not set session context:', err)
    }

    // Insert analytics event
    const { error } = await supabaseClient
      .from('momo_events')
      .insert({
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData || {}
      })

    if (error) {
      console.error('Analytics insert error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to log analytics event',
          code: 'ANALYTICS_FAILED',
          details: error.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Analytics event logged' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
}) 