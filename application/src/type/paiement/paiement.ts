import {OffrePanier} from "@/type/achat/offrePanier";


type PaymentStatus =
  | "requires_confirmation"
  | "succeeded"
  | "failed"
  | "refunded";

interface PaiementCharge {
  id: string;
  montant: number;
}

interface PaiementErreur {
  message: string;
}


export interface MockPaymentRequest {
  amount: number;
  force_failed?: boolean;
  items: OffrePanier[]
}

export interface GatewayReponse {
  id?: string;
  status: PaymentStatus;
  charges?: PaiementCharge[];
  error?: PaiementErreur;
  refund?: {
    status: "refunded";
    transaction_id: string;
  };
}