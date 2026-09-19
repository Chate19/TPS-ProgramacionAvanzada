import { Controller, Post, Body, Get, Req, Headers, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    // El ValidationPipe valida el JSON automáticamente antes de llegar acá[cite: 1]
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  @Get('success')
  success() {
    return { ok: true, message: 'Payment successful' }; // Respuesta sugerida por el TP[cite: 1]
  }

  @Get('cancel')
  cancel() {
    return { ok: false, message: 'Payment cancelled' }; // Respuesta sugerida por el TP[cite: 1]
  }

@Post('webhook')
  webhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    if (!signature) {
      throw new BadRequestException('Falta la firma de Stripe');
    }

    try {
      // Usamos req.rawBody directamente (el ! le asegura a TypeScript que el buffer existe)
      return this.paymentsService.handleWebhook(signature, req.rawBody!);
    } catch (error) {
      // Casteamos el error a tipo Error igual que en el servicio
      throw new BadRequestException((error as Error).message);
    }
  }
}