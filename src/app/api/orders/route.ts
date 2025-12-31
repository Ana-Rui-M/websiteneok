
import { firestore } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/lib/types';
import { revalidateTag } from 'next/cache';
import { getCachedOrders } from '@/lib/admin-cache';

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();
    console.log("[API Orders] POST - Creating order:", order.reference);
    
    const orderRef = firestore.collection('orders').doc(order.reference);
    await orderRef.set({
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log("[API Orders] POST - Order saved to Firestore:", order.reference);
    
    // Add document to 'mail' collection to trigger 'Trigger Email from Firestore' extension
    try {
      console.log("[API Orders] POST - Triggering email via 'mail' collection");
      await firestore.collection('mail').add({
        to: order.email,
        message: {
          subject: `Confirmação de Encomenda - ${order.reference}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #184f3f; text-align: center;">Obrigado pela sua encomenda!</h2>
              <p>Olá <strong>${order.guardianName}</strong>,</p>
              <p>Recebemos o seu pedido com sucesso. Abaixo estão os detalhes da sua encomenda:</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Referência:</strong> ${order.reference}</p>
                <p style="margin: 5px 0;"><strong>Total:</strong> ${order.total.toLocaleString('pt-PT', { style: 'currency', currency: 'AOA' })}</p>
                <p style="margin: 5px 0;"><strong>Método de Pagamento:</strong> ${order.paymentMethod}</p>
                <p style="margin: 5px 0;"><strong>Opção de Entrega:</strong> ${order.deliveryOption}</p>
              </div>

              <p>Por favor, realize o pagamento conforme o método selecionado para que possamos processar o seu pedido o mais rápido possível.</p>
              
              <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                <p>© ${new Date().getFullYear()} Neokudilonga. Todos os direitos reservados.</p>
              </div>
            </div>
          `,
        },
      });
      console.log("[API Orders] POST - Email trigger added to 'mail' collection");
    } catch (emailError) {
      console.error("[API Orders] POST - Error triggering email extension:", emailError);
    }

    try {
      console.log("[API Orders] POST - Triggering revalidateTag('orders')");
      revalidateTag('orders');
      console.log("[API Orders] POST - revalidateTag('orders') success");
    } catch (revalidateError) {
      console.warn("[API Orders] POST - Error revalidating tag 'orders':", revalidateError);
    }

    return NextResponse.json({ message: 'Order created successfully', reference: order.reference }, { status: 201 });
  } catch (error) {
    console.error('[API Orders] POST - Error creating order:', error);
    return NextResponse.json({ message: 'Error creating order', error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log("[API Orders] GET - Fetching orders");
    const orders = await getCachedOrders();
    console.log(`[API Orders] GET - Successfully fetched ${orders.length} orders`);
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('[API Orders] GET - Error fetching orders:', error);
    return NextResponse.json({ message: 'Error fetching orders', error: String(error) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
