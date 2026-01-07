
/**
 * Utility to interact with the WhatsApp Cloud API.
 */

const WHATSAPP_VERSION = 'v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export async function sendWhatsAppMessage(to: string, text: string) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.error('WhatsApp credentials not configured');
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${WHATSAPP_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: { body: text },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error('Error sending WhatsApp message:', data);
    }
    return data;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
  }
}

/**
 * Send a "typing" indicator (WhatsApp doesn't have a native typing indicator API like Messenger, 
 * but we can mark messages as read to show activity).
 */
export async function markAsRead(messageId: string) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) return;

  try {
    await fetch(
      `https://graph.facebook.com/${WHATSAPP_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        }),
      }
    );
  } catch (error) {
    console.error('Failed to mark message as read:', error);
  }
}
