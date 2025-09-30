'use client';

import { Button } from 'react-basics';
import { useRouter } from 'next/navigation';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { SetupData } from '../SetupPage';
import styles from './StepStyles.module.css';

interface FinishStepProps {
  data: SetupData;
  onNext: (data: Partial<SetupData>) => void;
  onBack?: () => void;
}

export function FinishStep({ data, onNext }: FinishStepProps) {
  const router = useRouter();

  const handleFinish = async () => {
    try {
      // Complete onboarding via API
      const response = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Set authentication token and user data
        setClientAuthToken(result.token);
        setUser(result.user);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('Failed to complete onboarding');
        onNext({});
      }
    } catch (err) {
      console.error('Error completing onboarding:', err);
      onNext({});
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.finishContainer}>
        <div className={styles.celebration}>
          🥳🎉
        </div>
        
        <h2 className={styles.finishTitle}>
          Hooray! You're all done!
        </h2>
        
        <p className={styles.finishMessage}>
          Your Oravo Analytics account is now set up and ready to go. 
          You can start tracking your website analytics right away!
        </p>

        <div className={styles.actions}>
          <Button variant="primary" onClick={handleFinish}>
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FinishStep;