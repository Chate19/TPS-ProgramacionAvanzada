import { IsArray, IsNumber, IsPositive, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

// 1. Definimos la estructura y reglas de cada ítem individual
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

// 2. Definimos el cuerpo principal de la petición[cite: 1]
export class PaymentSessionDto {
  @IsString()
  orderId: string;

  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1) // El array debe tener al menos un ítem[cite: 1]
  @ValidateNested({ each: true }) // Valida cada elemento dentro del array[cite: 1]
  @Type(() => PaymentItemDto) // Transforma los objetos planos al tipo PaymentItemDto para poder validarlos[cite: 1]
  items: PaymentItemDto[];
}