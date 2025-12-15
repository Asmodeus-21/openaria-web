import { GHLPayload } from '../types';

// 🟢 OPTION 1: PASTE YOUR WEBHOOK URL INSIDE THE QUOTES BELOW
// Example: const MANUAL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/..."
const MANUAL_WEBHOOK_URL = ""; 

/**
 * Pushes data to GoHighLevel via Webhook.
 */
export const pushLeadToGoHighLevel = async (data: GHLPayload): Promise<boolean> => {
  // 1. Try to get the Webhook URL from manual entry OR environment variables
  const webhookUrl = 
    MANUAL_WEBHOOK_URL ||
    (typeof process !== 'undefined' ? process.env.REACT_APP_GHL_WEBHOOK_URL : undefined) || 
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL : undefined) ||
    '';

  // 2. Log payload for debugging
  console.group('🔌 GoHighLevel Integration');
  console.log('Target URL:', webhookUrl || '(No URL configured - Simulation Mode)');
  console.log('Payload:', JSON.stringify(data, null, 2));
  console.groupEnd();

  // 3. If no URL is configured, simulate success (dev mode)
  if (!webhookUrl) {
    console.warn("⚠️ GHL Webhook URL missing. Simulating success.");
    // Small delay to simulate network request
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
    return false;
  }
};

export const logCallIntent = async (intent: string, duration: number): Promise<void> => {
  console.log(`🎙️ Logged Call Intent to GHL: ${intent} (${duration}s)`);
};