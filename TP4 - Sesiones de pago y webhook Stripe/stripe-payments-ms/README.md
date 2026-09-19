```markdown
# TP4 - Microservicio de Pagos con Stripe y Webhooks

**Alumno:** Agustin Chatelain
**Materia:** Programación Avanzada

Este repositorio contiene la implementación de un microservicio en NestJS para la gestión de pagos mediante sesiones de Stripe Checkout y la validación asíncrona de transacciones a través de Webhooks.

## ✅ Checklist de entrega
- [x] Entrega 1 funcionando (captura o HTTP del `POST` y `url` de Checkout)
- [x] Entrega 2 funcionando (log de `orderId` en el webhook)
- [x] `.env` no versionado; sí `.env.template`
- [x] README breve: cómo levantar y las dos rutas

---

## 🚀 Cómo levantar el proyecto

1. **Instalar dependencias:**
   Ejecutar en la terminal dentro de la raíz del proyecto:
   ```bash
   npm install

```

2. **Configurar variables de entorno:**
Crear un archivo `.env` en la raíz del proyecto basándose en el archivo `.env.template` suministrado. Completar los valores con las claves de prueba de Stripe:
```env
PORT=3003
STRIPE_SECRET=sk_test_...
STRIPE_SUCCESS_URL=http://localhost:3003/payments/success
STRIPE_CANCEL_URL=http://localhost:3003/payments/cancel
STRIPE_ENDPOINT_SECRET=whsec_...

```


3. **Iniciar el servidor local:**
```bash
npm run start:dev

```


El microservicio quedará escuchando en `http://localhost:3003`.
4. **Habilitar la escucha del Webhook (Stripe CLI):**
Para recibir los eventos de pago de forma local, ejecutar en una nueva terminal utilizando el ejecutable de Stripe:
```bash
stripe listen --forward-to localhost:3003/payments/webhook --events charge.succeeded

```



---

## 🛣️ Rutas disponibles (Endpoints)

### 1. Crear sesión de pago

Crea una nueva sesión en Stripe Checkout y devuelve la URL para redirigir al cliente. Cuenta con un `ValidationPipe` que exige la correcta estructura del array `items`.

* **URL:** `POST http://localhost:3003/payments/create-payment-session`
* **Body (JSON):**
```json
{
  "orderId": "ord-1",
  "currency": "usd",
  "items": [
    {
      "name": "Entrada TicketGo",
      "price": 20,
      "quantity": 1
    }
  ]
}

```


* **Respuesta exitosa (201 Created):**
```json
{
  "id": "cs_test_a1zGZ...",
  "url": "[https://checkout.stripe.com/c/pay/cs_test_a1zGZ](https://checkout.stripe.com/c/pay/cs_test_a1zGZ)..."
}

```



### 2. Escuchar eventos de Stripe (Webhook)

Endpoint interno utilizado de forma exclusiva por los servidores de Stripe (o la CLI en entorno local) para notificar cambios de estado en las transacciones de forma asíncrona. Valida la firma del evento usando el `rawBody` y el secreto del webhook.

* **URL:** `POST http://localhost:3003/payments/webhook`
* **Acción:** Al detectar un evento `charge.succeeded`, extrae el `orderId` de los metadatos y lo imprime en la consola del servidor (`[Stripe Webhook] Pago confirmado para la orden: ord-1`).

```

```