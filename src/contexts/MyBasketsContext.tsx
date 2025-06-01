
import React, { createContext, useContext, ReactNode } from 'react';
import { useBaskets } from './BasketContext';

interface MyBasketsContextType {
  myBaskets: any[];
  refreshMyBaskets: () => void;
}

const MyBasketsContext = createContext<MyBasketsContextType | undefined>(undefined);

export function MyBasketsProvider({ children }: { children: ReactNode }) {
  const { getMemberBaskets } = useBaskets();
  
  const myBaskets = getMemberBaskets();

  const refreshMyBaskets = () => {
    // Refresh logic would go here
    console.log('Refreshing my baskets...');
  };

  const value = {
    myBaskets,
    refreshMyBaskets,
  };

  return (
    <MyBasketsContext.Provider value={value}>
      {children}
    </MyBasketsContext.Provider>
  );
}

export function useMyBaskets() {
  const context = useContext(MyBasketsContext);
  if (context === undefined) {
    throw new Error('useMyBaskets must be used within a MyBasketsProvider');
  }
  return context;
}
