import { useRef, useState } from 'react';
import { ArrowLeft, RotateCcw, ShieldCheck } from 'lucide-react';
import Button from '@/components/shared/Button';

export default function OtpVerifyForm({ email, loading, onVerify, onBack, onResend }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newDigits.every((digit) => digit !== '')) {
      onVerify(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split('');
      setDigits(newDigits);
      inputsRef.current[5]?.focus();
      onVerify(pasted);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const code = digits.join('');
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-7 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-50 text-success-600">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="display-title mt-4 text-2xl text-ink">Comprova el correu</h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Hem enviat un codi a <span className="font-semibold text-ink">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-1.5 sm:gap-2.5">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => (inputsRef.current[index] = element)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={index === 0 ? handlePaste : undefined}
            autoFocus={index === 0}
            aria-label={`Dígit ${index + 1}`}
            className="h-12 w-10 rounded-xl border border-line bg-surface text-center text-lg font-bold text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:h-13 sm:w-11"
          />
        ))}
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={digits.some((digit) => !digit)}
        className="mt-6 w-full"
      >
        Verificar
      </Button>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Canviar correu
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-800 disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reenviar codi
        </button>
      </div>
    </form>
  );
}
