import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Mail, ArrowRight, Loader2 } from 'lucide-react';
import AuthService from '@/api/services/AuthService';
import { useAuth } from '@/context/AuthProvider';
import { useSnackbar } from '@/context/SnackbarProvider';
import OtpVerifyForm from './OtpVerifyForm';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await AuthService.requestOtp(email.trim());
      openSnackbar('Codi enviat al correu!', 'success');
      setStep('otp');
    } catch (err) {
      openSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code) => {
    setLoading(true);
    try {
      const response = await AuthService.verifyOtp(email.trim(), code);
      const userData = response.user?.data || response.user;
      login(response.token, userData);
      openSnackbar('Benvingut/da!', 'success');
      navigate('/');
    } catch (err) {
      openSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-festive-500 shadow-lg">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Amic Invisible</h1>
          <p className="mt-1 text-sm text-gray-500">Inicia sessió amb el teu correu</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {step === 'email' ? (
            <form onSubmit={handleRequestOtp}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correu electrònic
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="el-teu@correu.com"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm focus:border-festive-500 focus:outline-none focus:ring-2 focus:ring-festive-500/20 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-festive-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-festive-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Enviar codi
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <OtpVerifyForm
              email={email}
              loading={loading}
              onVerify={handleVerifyOtp}
              onBack={handleBack}
              onResend={handleRequestOtp}
            />
          )}
        </div>
      </div>
    </div>
  );
}
