import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        // Validate API Key
        const apiKey = req.headers.get('X-API-Key');
        const expectedApiKey = Deno.env.get('VIBECODE_API_KEY');
        
        if (!apiKey || apiKey !== expectedApiKey) {
            return Response.json(
                { status: 'error', message: 'Unauthorized: Invalid or missing API key' },
                { status: 401 }
            );
        }

        // Parse request body
        const payload = await req.json();
        const { recipientWalletAddress, pinCode, subject, body, fromName } = payload;

        // Validate required fields
        if (!recipientWalletAddress || !pinCode || !subject || !body) {
            return Response.json(
                { status: 'error', message: 'Missing required fields: recipientWalletAddress, pinCode, subject, body' },
                { status: 400 }
            );
        }

        // Create email in recipient's inbox using service role
        const base44 = createClientFromRequest(req);
        
        await base44.asServiceRole.entities.Email.create({
            from_wallet: 'ttt-verification-system',
            from_name: fromName || 'TTT Verification <ttt@fluxk.kas>',
            to_wallet: recipientWalletAddress,
            subject: subject,
            body: body,
            preview: `Your verification PIN: ${pinCode}`,
            folder: 'inbox',
            is_read: false
        });

        return Response.json(
            { status: 'success', message: 'Verification PIN email sent to Fluxkmail inbox.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in receiveVibecodePin:', error);
        return Response.json(
            { status: 'error', message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
});