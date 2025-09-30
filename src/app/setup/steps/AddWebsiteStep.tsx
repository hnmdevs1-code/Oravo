'use client';

import { useState } from 'react';
import { Button, Form, FormRow, TextField } from 'react-basics';
import { SetupData } from '../SetupPage';
import styles from './StepStyles.module.css';

interface AddWebsiteStepProps {
  data: SetupData;
  onNext: (data: Partial<SetupData>) => void;
  onBack?: () => void;
}

export function AddWebsiteStep({ data, onNext, onBack }: AddWebsiteStepProps) {
  const [websiteName, setWebsiteName] = useState(data.websiteName || '');
  const [websiteDomain, setWebsiteDomain] = useState(data.websiteDomain || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!websiteName.trim() || !websiteDomain.trim()) {
      setError('Please fill in both name and domain');
      setIsLoading(false);
      return;
    }

    try {
      // Create the website via API
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: websiteName.trim(),
          domain: websiteDomain.trim(),
        }),
      });

      if (response.ok) {
        const website = await response.json();
        onNext({ 
          websiteName: websiteName.trim(), 
          websiteDomain: websiteDomain.trim(),
          websiteId: website.id 
        });
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to create website');
      }
    } catch (err) {
      setError('Failed to create website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDomain = (value: string) => {
    // Remove protocol and trailing slash
    return value
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '')
      .toLowerCase();
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDomain(e.target.value);
    setWebsiteDomain(formatted);
  };

  const isFormValid = websiteName.trim() && websiteDomain.trim();

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Add a website</h2>
        <p>Add a website to start tracking.</p>
      </div>

      <Form onSubmit={handleSubmit}>
        <div className={styles.websiteForm}>
          <FormRow label="Name">
            <TextField
              name="websiteName"
              placeholder="My Awesome Website"
              value={websiteName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setWebsiteName(e.target.value)
              }
            />
          </FormRow>

          <FormRow label="Domain">
            <TextField
              name="websiteDomain"
              placeholder="example.com"
              value={websiteDomain}
              onChange={handleDomainChange}
            />
          </FormRow>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          {onBack && (
            <Button type="button" variant="quiet" onClick={onBack}>
              Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Creating...' : 'Continue'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AddWebsiteStep;