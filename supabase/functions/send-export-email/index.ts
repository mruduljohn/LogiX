import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { recipientEmail, downloadUrl, message } = await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Send email using Supabase's email service
    const { error } = await supabaseClient.auth.admin.sendRawEmail({
      to: recipientEmail,
      subject: 'Your LogiX Export is Ready',
      html: `
        <h1>Your LogiX Export is Ready</h1>
        <p>${message}</p>
        <p>Click the link below to download your export:</p>
        <a href="${downloadUrl}">Download Export</a>
        <p>This link will expire in 7 days.</p>
        <p>If you didn't request this export, please ignore this email.</p>
      `,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 