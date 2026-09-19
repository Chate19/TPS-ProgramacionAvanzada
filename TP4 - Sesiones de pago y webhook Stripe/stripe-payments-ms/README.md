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