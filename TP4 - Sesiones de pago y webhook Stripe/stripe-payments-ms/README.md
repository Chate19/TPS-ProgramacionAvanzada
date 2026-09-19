# TP4 - Sesiones de pago y webhook Stripe (Proyecto Completo)

A continuación tienes todos los archivos necesarios para tu microservicio.

## `.env.template`
```env
PORT=3003
STRIPE_SECRET=
STRIPE_SUCCESS_URL=http://localhost:3003/payments/success
STRIPE_CANCEL_URL=http://localhost:3003/payments/cancel
STRIPE_ENDPOINT_SECRET=
```

## `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Microservicio corriendo en http://localhost:${port}`);
}
bootstrap();
```

## `src/payments/dto/payment-session.dto.ts`
```typescript
import { IsArray, IsNumber, IsPositive, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class PaymentSessionDto {
  @IsString()
  orderId: string;

  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  items: PaymentItemDto[];
}
```

## `src/payments/payments.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
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
      success_url: process.env.STRIPE_SUCCESS_URL, 
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return {
      id: session.id,
      url: session.url,
    };
  }

  handleWebhook(signature: string, rawBody: Buffer) {
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
```

## `src/payments/payments.controller.ts`
```typescript
import { Controller, Post, Body, Get, Req, Headers, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  @Get('success')
  success() {
    return { ok: true, message: 'Payment successful' };
  }

  @Get('cancel')
  cancel() {
    return { ok: false, message: 'Payment cancelled' };
  }

  @Post('webhook')
  webhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    if (!signature) {
      throw new BadRequestException('Falta la firma de Stripe');
    }

    try {
      return this.paymentsService.handleWebhook(signature, req.rawBody!);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
```

## `README.md`
```md
# TP4 - Sesiones de pago y webhook Stripe

Microservicio desarrollado en NestJS para gestionar la creación de sesiones de pago con Stripe y la recepción asíncrona de confirmaciones mediante Webhooks.

## Cómo levantar el proyecto

1. Instalar dependencias:
   `npm install`

2. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto basándose en el `.env.template` entregado.
   - Completar `STRIPE_SECRET` con la clave secreta de prueba y `STRIPE_ENDPOINT_SECRET` con la clave del webhook.

3. Iniciar el servidor:
   `npm run start:dev`
   El microservicio se levantará en el puerto 3003.

4. Escuchar webhooks localmente (Stripe CLI):
   En una terminal paralela, ejecutar para reenviar los eventos al servidor local:
   `stripe listen --forward-to localhost:3003/payments/webhook`

---

## Rutas principales

### 1. Crear sesión de Checkout
- **Método y Ruta:** `POST /payments/create-payment-session`
- **Descripción:** Recibe los datos de la orden, crea una sesión en Stripe en modo pago y retorna el ID y la URL para la redirección al checkout.
- **Body requerido (JSON):**
  {
    "orderId": "ord-1",
    "currency": "usd",
    "items": [
      { "name": "Producto de prueba", "price": 20, "quantity": 1 }
    ]
  }

### 2. Webhook de confirmación
- **Método y Ruta:** `POST /payments/webhook`
- **Descripción:** Endpoint que recibe los eventos asíncronos de Stripe (como `charge.succeeded`). Valida la firma de seguridad usando la cabecera `stripe-signature` contra el cuerpo crudo (`rawBody`) de la petición.
```