'use client';

import { useState } from 'react';
import { Button, Form, FormRow, TextField } from 'react-basics';
import { SetupData } from '../SetupPage';
import styles from './StepStyles.module.css';

interface VerifyEmailStepProps {
  data: SetupData;
  onNext: (data: Partial<SetupData>) => void;
  onBack?: () => void;
}

export function VerifyEmailStep({ data, onNext }: VerifyEmailStepProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setIsLoading(false);
      return;
    }

    try {
      // Call API to verify the code
      const response = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          code: verificationCode,
        }),
      });

      if (response.ok) {
        onNext({ verificationCode });
      } else {
        const result = await response.json();
        setError(result.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });
      // Show success message or toast
    } catch (err) {
      console.error('Failed to resend email:', err);
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Verify email address</h2>
        <p>Enter the 6-digit code that was sent to your email:</p>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormRow>
          <TextField
            name="verificationCode"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            maxLength={6}
            style={{ 
              textAlign: 'center', 
              fontSize: '18px', 
              letterSpacing: '4px',
              fontFamily: 'monospace'
            }}
          />
        </FormRow>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </Form>

      <div className={styles.resendSection}>
        <p>If you have not received a confirmation email, use the button below to receive a new one.</p>
        <Button variant="quiet" onClick={handleResendEmail}>
          Resend email
        </Button>
      </div>
    </div>
  );
}

export default VerifyEmailStep;