// Auto-generated shim for transaction service
export interface Transaction {
  id: string;
  amount: number;
  phone: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  ussd?: string;
}

export const transactionService = {
  createTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    const transaction: Transaction = {
      id: 'txn_' + Date.now(),
      amount: data.amount || 0,
      phone: data.phone || '',
      status: 'pending',
      timestamp: Date.now(),
      ...data
    };
    console.log('Transaction: Created', transaction);
    return transaction;
  },
  
  updateTransaction: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
    console.log('Transaction: Updated', id, updates);
    return { id, ...updates } as Transaction;
  },
  
  getTransaction: async (id: string): Promise<Transaction | null> => {
    console.log('Transaction: Getting', id);
    return null;
  },
  
  getTransactions: async (): Promise<Transaction[]> => {
    console.log('Transaction: Getting all');
    return [];
  }
};

export default transactionService;
