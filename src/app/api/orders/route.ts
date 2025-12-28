
import { firestore } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/lib/types';
import { revalidateTag } from 'next/cache';
import { getCachedOrders } from '@/lib/admin-cache';

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();
    const orderRef = firestore.collection('orders').doc(order.reference);
    await orderRef.set(order);

    revalidateTag('orders');

    return NextResponse.json({ message: 'Order created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await getCachedOrders();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
