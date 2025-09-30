'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from 'react-basics';
import Logo from '@/assets/logo.svg';
import VerifyEmailStep from './steps/VerifyEmailStep';
import DataRegionStep from './steps/DataRegionStep';
import UpdateProfileStep from './steps/UpdateProfileStep';
import AddWebsiteStep from './steps/AddWebsiteStep';
import TrackingCodeStep from './steps/TrackingCodeStep';
import FinishStep from './steps/FinishStep';
import styles from './SetupPage.module.css';

export interface SetupData {
  email?: string;
  verificationCode?: string;
  dataRegion?: string;
  role?: string;
  websiteType?: string;
  primaryGoal?: string;
  websiteName?: string;
  websiteDomain?: string;
  trackingCode?: string;
}

const STEPS = [
  { id: 'verify-email', title: 'Verify email address', component: VerifyEmailStep },
  { id: 'data-region', title: 'Select data region', component: DataRegionStep },
  { id: 'update-profile', title: 'Update profile', component: UpdateProfileStep },
  { id: 'add-website', title: 'Add a website', component: AddWebsiteStep },
  { id: 'tracking-code', title: 'Add tracking code', component: TrackingCodeStep },
  { id: 'finish', title: 'Finish', component: FinishStep },
];

export function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({});

  useEffect(() => {
    // Get email from URL params if available
    const email = searchParams.get('email');
    if (email) {
      setSetupData(prev => ({ ...prev, email }));
    }
  }, [searchParams]);

  const handleNext = (data: Partial<SetupData>) => {
    const updatedData = { ...setupData, ...data };
    setSetupData(updatedData);
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Setup complete, redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Icon className={styles.logo} size="xl">
            <Logo />
          </Icon>
          <h1 className={styles.title}>Welcome to Oravo Analytics!</h1>
          <p className={styles.subtitle}>Let's get your account set up!</p>
        </div>

        <div className={styles.steps}>
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.step} ${
                index === currentStep ? styles.active : ''
              } ${index < currentStep ? styles.completed : ''}`}
            >
              <div className={styles.stepNumber}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={styles.stepTitle}>{step.title}</span>
            </div>
          ))}
        </div>

        <div className={styles.stepContent}>
          <CurrentStepComponent
            data={setupData}
            onNext={handleNext}
            onBack={currentStep > 0 ? handleBack : undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default SetupPage;