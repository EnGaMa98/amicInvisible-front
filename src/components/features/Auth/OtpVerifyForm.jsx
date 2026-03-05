import { useRef, useState } from 'react';
import { ArrowLeft, Loader2, ShieldCheck, RotateCcw } from 'lucide-react';

export default function OtpVerifyForm({ email, loading, onVerify, onBack, onResend }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newDigits.every((d) => d !== '')) {
      onVerify(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split('');
      setDigits(newDigits);
      inputsRef.current[5]?.focus();
      onVerify(pasted);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <ShieldCheck className="mx-auto h-10 w-10 text-pine-500" />
        <h2 className="mt-3 text-lg font-semibold text-gray-900">Verificació</h2>
        <p className="mt-1 text-sm text-gray-500">
          Hem enviat un codi a <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2.5">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            autoFocus={i === 0}
            className="h-13 w-11 rounded-xl border border-gray-300 text-center text-xl font-bold text-gray-900 focus:border-festive-500 focus:outline-none focus:ring-2 focus:ring-festive-500/20 transition-colors"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading || digits.some((d) => !d)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-festive-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-festive-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Verificar'
        )}
      </button>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Canviar correu
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="flex items-center gap-1 text-sm text-festive-500 hover:text-festive-600 transition-colors disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reenviar codi
        </button>
      </div>
    </form>
  );
}
