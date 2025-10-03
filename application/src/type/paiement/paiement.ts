export interface PaiementCharge {
  id: string;
  montant: number;
}

export interface PaiementErreur {
  message: string;
}

export interface GatewayReponseSucces {
  id: string;
  status: "succeeded";
  charges: PaiementCharge[];
}

export interface GatewayReponseEchec {
  id: string;
  status: "failed";
  error: PaiementErreur;
}

export type GatewayResponse = GatewayReponseSucces | GatewayReponseEchec;


export interface MockPaymentRequest {
  amount: number;
  force_failed?: boolean;
}

export interface MockPaymentResponse {
  success: boolean;
  gateway_response: GatewayResponse;
}
