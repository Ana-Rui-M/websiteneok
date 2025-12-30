
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
