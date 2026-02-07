import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { kaspaAddress, pinCode } = await req.json();

        if (!kaspaAddress || !pinCode) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const fluxkmailApiUrl = Deno.env.get('FLUXKMAIL_API_URL');
        const fluxkmailApiKey = Deno.env.get('FLUXKMAIL_API_KEY');

        if (!fluxkmailApiUrl || !fluxkmailApiKey) {
            return Response.json({ error: 'Fluxkmail credentials not configured' }, { status: 500 });
        }

        const response = await fetch(fluxkmailApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': fluxkmailApiKey
            },
            body: JSON.stringify({
                recipientWalletAddress: kaspaAddress,
                pinCode: pinCode,
                subject: 'CreditCode PIN Verification',
                body: `Your CreditCode verification PIN is: ${pinCode}\n\nThis PIN will expire in 10 minutes.`
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Fluxkmail error:', error);
            return Response.json({ error: 'Failed to send PIN' }, { status: response.status });
        }

        return Response.json({ success: true, message: 'PIN sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});