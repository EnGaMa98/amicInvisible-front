import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gift, Mail } from 'lucide-react';
import AuthService from '@/api/services/AuthService';
import { useAuth } from '@/context/AuthProvider';
import { useSnackbar } from '@/context/SnackbarProvider';
import Button from '@/components/shared/Button';
import { fieldClassName } from '@/components/shared/FormField';
import OtpVerifyForm from './OtpVerifyForm';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await AuthService.requestOtp(email.trim());
      openSnackbar('Codi enviat al correu!', 'success');
      setStep('otp');
    } catch (error) {
      openSnackbar(error.message, 'error');
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
    } catch (error) {
      openSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-100/65 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent-100/55 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-800 text-surface shadow-lg shadow-brand-800/15">
            <Gift className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Regals amb intenció</p>
          <h1 className="display-title mt-2 text-4xl text-ink">Amic Invisible</h1>
          <p className="mt-2 text-sm text-ink-muted">Organitza el sorteig de manera simple i elegant.</p>
        </div>

        <div className="editorial-surface rounded-2xl p-6 sm:p-8">
          {step === 'email' ? (
            <form onSubmit={handleRequestOtp}>
              <div className="mb-6">
                <h2 className="display-title text-2xl text-ink">Benvingut/da</h2>
                <p className="mt-1 text-sm leading-6 text-ink-muted">Enviarem un codi d'accés al teu correu electrònic.</p>
              </div>
              <label className="block text-sm font-semibold text-ink" htmlFor="email">Correu electrònic</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="el-teu@correu.com"
                  required
                  autoFocus
                  className={`${fieldClassName} pl-10`}
                />
              </div>
              <Button type="submit" loading={loading} disabled={!email.trim()} className="mt-5 w-full">
                Continuar
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          ) : (
            <OtpVerifyForm
              email={email}
              loading={loading}
              onVerify={handleVerifyOtp}
              onBack={() => setStep('email')}
              onResend={handleRequestOtp}
            />
          )}
        </div>
        <p className="mt-6 text-center text-xs text-ink-muted">Accés privat i segur per als membres del grup</p>
      </div>
    </div>
  );
}
