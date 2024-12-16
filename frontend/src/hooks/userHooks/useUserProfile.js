import { useState, useEffect } from 'react';
import { getProfileRequest } from '../../services/userService';

const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await getProfileRequest();
        if (response.success) {
          setProfile(response.user);
        } else {
          throw new Error(
            response.message || 'Nie udało się załadowac profilu.'
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  return { profile, loading, error };
};

export default useUserProfile;
