import { useState, useEffect, useCallback } from 'react';
import { getUsersTransactionsRequest } from 'services/userService';

const useUserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUsersTransactionsRequest();
      console.log(response);
      if (response.success) {
        setTransactions(response.transactions || []);
      } else {
        throw new Error(
          response.message || 'Nie udało się załadować transakcji.'
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetchTransactions = useCallback(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, error, refetchTransactions };
};

export default useUserTransactions;
