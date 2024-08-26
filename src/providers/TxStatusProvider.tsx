import { createContext, useState } from 'react';

type ContextType = {
  loading: boolean;
  setLoading: (val: boolean) => void;

  isError: boolean;
  setIsError: (val: boolean) => void;

  isSuccess: boolean;
  setIsSuccess: (val: boolean) => void;

  txHash: string | null;
  setTxHash: (val: string) => void;
};

interface TxStatusProps {
  children: React.ReactElement;
}

export const TxStatusContext = createContext({} as ContextType);

export const TxStatusProvider = ({ children }: TxStatusProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  return (
    <TxStatusContext.Provider
      value={{
        loading,
        setLoading,
        isError,
        setIsError,
        isSuccess,
        setIsSuccess,
        txHash,
        setTxHash,
      }}
    >
      {children}
    </TxStatusContext.Provider>
  );
};
