'use client';

import { useState } from 'react';
import { Button, Form, FormRow, Dropdown } from 'react-basics';
import { SetupData } from '../SetupPage';
import styles from './StepStyles.module.css';

interface UpdateProfileStepProps {
  data: SetupData;
  onNext: (data: Partial<SetupData>) => void;
  onBack?: () => void;
}

const ROLES = [
  { value: 'marketer', label: 'Marketer' },
  { value: 'developer', label: 'Developer' },
  { value: 'creator', label: 'Creator' },
  { value: 'agency', label: 'Agency' },
  { value: 'other', label: 'Other' },
];

const WEBSITE_TYPES = [
  { value: 'business', label: 'Business' },
  { value: 'media', label: 'Media' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'personal', label: 'Personal' },
  { value: 'clients', label: 'Client website(s)' },
  { value: 'other', label: 'Other' },
];

const PRIMARY_GOALS = [
  { value: 'traffic', label: 'Measuring traffic (views / visitors)' },
  { value: 'events', label: 'Tracking events (signups / purchases)' },
  { value: 'campaigns', label: 'Analyzing campaigns (conversions / ad spend)' },
  { value: 'other', label: 'Other' },
];

export function UpdateProfileStep({ data, onNext, onBack }: UpdateProfileStepProps) {
  const [role, setRole] = useState(data.role || '');
  const [websiteType, setWebsiteType] = useState(data.websiteType || '');
  const [primaryGoal, setPrimaryGoal] = useState(data.primaryGoal || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role && websiteType && primaryGoal) {
      try {
        // Update profile via API
        const response = await fetch('/api/auth/update-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            dataRegion: data.dataRegion,
            userRole: role,
            websiteType,
            primaryGoal,
          }),
        });

        if (response.ok) {
          onNext({ role, websiteType, primaryGoal });
        } else {
          console.error('Failed to update profile');
        }
      } catch (err) {
        console.error('Error updating profile:', err);
      }
    }
  };

  const isFormValid = role && websiteType && primaryGoal;

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Update profile</h2>
        <p>Help us tailor the experience to your needs.</p>
      </div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <FormRow label="What is your role?">
            <Dropdown
              items={ROLES}
              value={role}
              onChange={(value: string) => setRole(value)}
              placeholder="Select your role"
            />
          </FormRow>

          <FormRow label="What kind of website will you use with Oravo?">
            <Dropdown
              items={WEBSITE_TYPES}
              value={websiteType}
              onChange={(value: string) => setWebsiteType(value)}
              placeholder="Select website type"
            />
          </FormRow>

          <FormRow label="What is your primary goal for using Oravo?">
            <Dropdown
              items={PRIMARY_GOALS}
              value={primaryGoal}
              onChange={(value: string) => setPrimaryGoal(value)}
              placeholder="Select your primary goal"
            />
          </FormRow>
        </div>

        <div className={styles.actions}>
          {onBack && (
            <Button type="button" variant="quiet" onClick={onBack}>
              Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid}
          >
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateProfileStep;