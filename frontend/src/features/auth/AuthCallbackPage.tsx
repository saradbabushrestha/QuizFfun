import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuth';
import { getMe } from '@/lib/api';
import { toast } from 'sonner';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast.error("Authentication failed. No token received.");
      navigate('/signin');
      return;
    }

    const processLogin = async () => {
      try {
        localStorage.setItem('token', token);
        const user = await getMe();
        setAuth(user, token);
        toast.success("Signed in successfully!");
        navigate('/app');
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Authentication failed. Please try again.");
        localStorage.removeItem('token');
        navigate('/signin');
      }
    };

    processLogin();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 text-primary-500" />
      </motion.div>
      <h2 className="mt-4 text-xl font-medium text-surface-900">Completing sign in...</h2>
      <p className="text-surface-500 mt-2">Please wait a moment.</p>
    </div>
  );
}
