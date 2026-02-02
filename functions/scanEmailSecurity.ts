import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emailBody, emailSubject } = await req.json();

    // Use AI to analyze email for malicious content
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a cybersecurity expert analyzing an email for potential threats. Analyze the following email for:
1. Malicious or phishing links
2. Suspicious attachments or file requests
3. Social engineering tactics
4. Impersonation attempts
5. Urgency manipulation
6. Request for sensitive information

Email Subject: ${emailSubject}
Email Body: ${emailBody}

Provide a security assessment with:
- Overall threat level (SAFE, LOW, MEDIUM, HIGH, CRITICAL)
- Specific threats found (if any)
- Detailed explanation
- Recommendations for the user

Be concise but thorough. If the email is safe, clearly state that.`,
      response_json_schema: {
        type: "object",
        properties: {
          threat_level: {
            type: "string",
            enum: ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"]
          },
          threats_found: {
            type: "array",
            items: { type: "string" }
          },
          explanation: { type: "string" },
          recommendations: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["threat_level", "threats_found", "explanation", "recommendations"]
      }
    });

    return Response.json(result);
  } catch (error) {
    console.error('Security scan error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});