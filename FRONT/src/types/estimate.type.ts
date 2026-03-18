export type Estimate = {
  id: number;
  title: string;
  estimate_number: number;
  payment_type: string;
  is_validated_by_customer: boolean;
  limit_date: string;
  project_id?: number;
  lines: {
    id: number;
    quantity: number;
    description: string;
    price_per_qty: number;
  }[];
};

export type PaymentType = "cash" | "check" | "credit_card" | "bank_transfer";


export type CreateEstimateDto = {
  title: string;
  estimate_number: number;
  payment_type?: PaymentType;
  is_validated_by_customer?: boolean;
  limit_date: string | Date;
  project_id: number;
  entreprise_id: number;
  lines?: {
    quantity: number;
    description: string;
    price_per_qty: number;
  }[];
};

export type UpdateEstimateDto = Partial<CreateEstimateDto>;
