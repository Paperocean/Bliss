import { useState, useEffect } from 'react';
import { getUsersTransactionsRequest } from 'services/userService';

const useUserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getUsersTransactionsRequest();
        console.log(response);
        if (response.success) {
          setTransactions(response.transactions || null);
        } else {
          throw new Error(
            response.message || 'Nie udało się załadować biletów.'
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, loading, error };
};

export default useUserTransactions;
