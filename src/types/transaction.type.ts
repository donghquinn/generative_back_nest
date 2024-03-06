export interface TransactionBaseObject {
  from?: string;
  to?: string;
  data?: string;
  nonce?: number;
  value?: string;
  gas?: string;
  gasPrice?: string;
  gasLimit?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface Web3ValueTransfer {
  from: string;
  to: string;
  nonce: number | BigInt;
  value: string;
  data?: string;
  input?: string;
  gas?: string | BigInt;
  gasLimit: string | BigInt;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface SignedTransaction {
  rawTransaction: string;
  transactionHash: string;
}
