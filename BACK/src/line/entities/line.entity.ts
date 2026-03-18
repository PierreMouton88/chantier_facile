import { Decimal } from '@prisma/client/runtime/library';

export class Line {
  id: number;
  quantity: number;
  description: string;
  price_per_qty: Decimal;
  estimate_id: number;
  updated_at: Date;
  created_at: Date;
}
