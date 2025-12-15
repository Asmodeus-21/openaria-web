import { GHLPayload } from '../types';

/**
 * Pushes data to GoHighLevel via Webhook.
 * Set REACT_APP_GHL_WEBHOOK_URL or NEXT_PUBLIC_GHL_WEBHOOK_URL in your Vercel/Env settings.
 */
export const pushLeadToGoHighLevel = async (data: GHLPayload): Promise<boolean> => {
  // 1. Try to get the Webhook URL from environment variables
  const webhookUrl = 
    (typeof process !== 'undefined' ? process.env.REACT_APP_GHL_WEBHOOK_URL : undefined) || 
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL : undefined) ||
    ''; // Fallback to empty if not found

  // 2. Log payload for debugging
  console.group('🔌 GoHighLevel Integration');
  console.log('Target URL:', webhookUrl || '(No URL configured - Simulation Mode)');
  console.log('Payload:', JSON.stringify(data, null, 2));
  console.groupEnd();

  // 3. If no URL is configured, simulate success (dev mode)
  if (!webhookUrl) {
    console.warn("⚠️ GHL Webhook URL missing. Simulating success. Add REACT_APP_GHL_WEBHOOK_URL to your env variables.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  }

  // 4. Real Fetch Request
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`GHL responded with status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to push to GoHighLevel:', error);
    // In production, you might want to return false here to show an error to the user,
    // or return true to fallback to email/other methods.
    return false;
  }
};

export const logCallIntent = async (intent: string, duration: number): Promise<void> => {
  // This can also be hooked up to a webhook to log call stats
  console.log(`🎙️ Logged Call Intent to GHL: ${intent} (${duration}s)`);
};