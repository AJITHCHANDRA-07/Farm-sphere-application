import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'choose' | 'phone' | 'email'>('choose');
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ================================================================
  // ✅ REAL GOOGLE SIGN IN — Opens browser saved accounts instantly
  // ================================================================
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/',
          queryParams: {
            prompt: 'select_account', // Always show account picker
          },
        },
      });
      if (error) throw error;
      // Page will redirect to Google automatically
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
      setLoading(false);
    }
  };

  // ================================================================
  // ✅ REAL PHONE OTP — Sends actual SMS via Supabase
  // ================================================================
  const sendPhoneOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      console.log('🔍 Sending OTP to:', formattedPhone);
      console.log('📱 Phone length:', phone.length);
      console.log('🌐 Formatted phone:', formattedPhone);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      
      console.log('📲 Supabase response:', { data, error });
      console.log('📊 Response details:', {
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.status
      });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ OTP sent successfully!');
      console.log('📱 Check your phone for SMS from Supabase');
      setStep(2);
    } catch (err: any) {
      console.error('❌ OTP send error:', err);
      console.error('❌ Error stack:', err.stack);
      setError(err.message || 'Failed to send OTP. Check Supabase phone auth settings.');
    }
    setLoading(false);
  };

  // ================================================================
  // ✅ REAL OTP VERIFICATION
  // ================================================================
  const verifyPhoneOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      console.log('🔍 Verifying OTP:', { phone: formattedPhone, otp, type: 'sms' });
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });
      
      console.log('📲 OTP verification response:', { data, error });
      
      if (error) {
        console.error('❌ OTP verification error:', error);
        throw error;
      }
      
      console.log('✅ OTP verified successfully!');
      onSuccess(data.user);
      onClose();
      window.location.href = '/';
    } catch (err: any) {
      console.error('❌ OTP verification error:', err);
      setError('Invalid OTP. Please check the SMS and try again.');
    }
    setLoading(false);
  };

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    modal: {
      background: '#fff',
      borderRadius: '16px',
      padding: '40px 32px',
      width: '100%',
      maxWidth: '420px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    },
    close: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '8px',
      borderRadius: '50%',
    },
    title: {
      margin: 0,
      fontSize: '24px',
      fontWeight: 700,
      color: '#111',
      textAlign: 'center',
    },
    subtitle: {
      margin: 0,
      color: '#666',
      fontSize: '14px',
      textAlign: 'center',
    },
    input: {
      padding: '14px 16px',
      borderRadius: '10px',
      border: '1.5px solid #ddd',
      fontSize: '16px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    btnGoogle: {
      padding: '14px',
      borderRadius: '10px',
      background: '#fff',
      color: '#444',
      border: '1.5px solid #ddd',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    btnPrimary: {
      padding: '14px',
      borderRadius: '10px',
      background: '#16a34a',
      color: '#fff',
      border: 'none',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
    },
    btnSecondary: {
      padding: '14px',
      borderRadius: '10px',
      background: '#f4f4f4',
      color: '#111',
      border: '1.5px solid #ddd',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
    },
    back: {
      background: 'none',
      border: 'none',
      color: '#666',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '8px 0',
    },
    error: {
      color: '#dc2626',
      fontSize: '14px',
      textAlign: 'center',
      margin: 0,
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#9ca3af',
      fontSize: '13px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#e5e7eb',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={onClose}>✕</button>

        {/* ── CHOOSE MODE ── */}
        {mode === 'choose' && (
          <>
            <h2 style={styles.title}>Welcome to FarmSphere</h2>
            <p style={styles.subtitle}>Sign in to continue</p>

            {/* ✅ REAL GOOGLE BUTTON */}
            <button style={styles.btnGoogle} onClick={handleGoogleSignIn} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Opening Google...' : 'Continue with Google'}
            </button>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span>or</span>
              <div style={styles.dividerLine} />
            </div>

            <button style={styles.btnSecondary} onClick={() => setMode('phone')}>
              📱 Continue with Mobile Number
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </>
        )}

        {/* ── PHONE STEP 1 ── */}
        {mode === 'phone' && step === 1 && (
          <>
            <h2 style={styles.title}>📱 Mobile Number</h2>
            <p style={styles.subtitle}>We'll send a real OTP to your number</p>
            <input
              style={styles.input}
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button
              style={styles.btnPrimary}
              onClick={sendPhoneOTP}
              disabled={loading || phone.length !== 10}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <button style={styles.back} onClick={() => setMode('choose')}>← Back</button>
          </>
        )}

        {/* ── PHONE STEP 2 ── */}
        {mode === 'phone' && step === 2 && (
          <>
            <h2 style={styles.title}>🔢 Enter OTP</h2>
            <p style={styles.subtitle}>Sent to +91{phone}</p>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button
              style={styles.btnPrimary}
              onClick={verifyPhoneOTP}
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button style={styles.back} onClick={() => { setStep(1); setOtp(''); setError(''); }}>
              ← Resend OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
