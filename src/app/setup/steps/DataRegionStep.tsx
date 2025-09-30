'use client';

import { useState } from 'react';
import { Button } from 'react-basics';
import { SetupData } from '../SetupPage';
import styles from './StepStyles.module.css';

interface DataRegionStepProps {
  data: SetupData;
  onNext: (data: Partial<SetupData>) => void;
  onBack?: () => void;
}

const REGIONS = [
  {
    id: 'nigeria',
    name: 'Nigeria',
    flag: '🇳🇬',
    description: 'Data stored in Nigeria'
  },
  {
    id: 'eu',
    name: 'European Union',
    flag: '🇪🇺',
    description: 'Data stored in EU'
  }
];

export function DataRegionStep({ data, onNext, onBack }: DataRegionStepProps) {
  const [selectedRegion, setSelectedRegion] = useState(data.dataRegion || '');

  const handleSubmit = () => {
    if (selectedRegion) {
      onNext({ dataRegion: selectedRegion });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Select data region</h2>
        <p>Choose where your analytics data will be stored</p>
      </div>

      <div className={styles.regionOptions}>
        {REGIONS.map((region) => (
          <div
            key={region.id}
            className={`${styles.regionOption} ${
              selectedRegion === region.id ? styles.selected : ''
            }`}
            onClick={() => setSelectedRegion(region.id)}
          >
            <div className={styles.regionFlag}>{region.flag}</div>
            <div className={styles.regionInfo}>
              <h3>{region.name}</h3>
              <p>{region.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        {onBack && (
          <Button variant="quiet" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedRegion}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default DataRegionStep;