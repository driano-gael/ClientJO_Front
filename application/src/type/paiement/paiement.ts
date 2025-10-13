import {OffrePanier} from "@/type/achat/offrePanier";

/**
 * Statut de paiement possible
 */
export type PaymentStatus =
  | "requires_confirmation"
  | "succeeded"
  | "failed"
  | "refunded";

/**
 * Interface représentant une charge de paiement
 */
export interface PaiementCharge {
  id: string;
  montant: number;
}

/**
 * Interface représentant une erreur de paiement
 */
export interface PaiementErreur {
  message: string;
}


export interface MockPaymentRequest {
  amount: number;
  force_failed?: boolean;
  items: OffrePanier[]
}

export interface MockPaymentResponse {
  gateway_response: GatewayReponse;
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