import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
  // Volvemos a usar la variable de entorno para la clave secreta
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET!);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment', 
      // Restauramos las variables de entorno para las redirecciones
      success_url: process.env.STRIPE_SUCCESS_URL, 
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return {
      id: session.id,
      url: session.url,
    };
  }

  handleWebhook(signature: string, rawBody: Buffer) {
    // Restauramos la variable de entorno para la firma del webhook
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${(err as Error).message}`);
    }

    switch (event.type) {
      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
        const orderId = charge.metadata.orderId;
        console.log(`[Stripe Webhook] Pago confirmado para la orden: ${orderId}`);
        break;
      default:
        console.log(`[Stripe Webhook] Evento no manejado: ${event.type}`);
    }

    return { received: true };
  }
}