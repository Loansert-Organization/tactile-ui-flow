
const mockPromise = <T>(data: T, delay = 1000): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export interface GuestContributionPayload {
  basketId: string;
  amount: number;
  currency: string;
  contributorName?: string;
}

export interface ContributionResponse {
  txId: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export const contributeGuest = async (payload: GuestContributionPayload): Promise<ContributionResponse> => {
  console.log('[Contribution] Guest contribution:', payload);
  
  return mockPromise({
    txId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: payload.amount,
    currency: payload.currency,
    timestamp: new Date().toISOString(),
    status: 'completed' as const
  });
};
