'use client';

import { Icon, Button } from 'react-basics';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/assets/logo.svg';
import styles from './ThankYouPage.module.css';

export function ThankYouPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Icon className={styles.icon} size="xl">
          <Logo />
        </Icon>
        <h1 className={styles.title}>Thank you for signing up for Oravo Analytics!</h1>
        <div className={styles.message}>
          <p>We've sent you an email to verify your email address.</p>
          <p>Please check your inbox and click the verification link to complete your account setup.</p>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={handleContinue}>
            Continue to Dashboard
          </Button>
          <div className={styles.loginLink}>
            Already verified? <Link href="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;