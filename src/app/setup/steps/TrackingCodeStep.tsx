'use client';

import { useState, useEffect } from 'react';
import { Button } from 'react-basics';
import { SetupData } from '../SetupPage';
import styles from './StepStyles.module.css';

interface TrackingCodeStepProps {
  data: SetupData;
  onNext: (data: Partial<SetupData>) => void;
  onBack?: () => void;
}

export function TrackingCodeStep({ data, onNext, onBack }: TrackingCodeStepProps) {
  const [trackingCode, setTrackingCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate tracking code based on website data
    if (data.websiteId && data.websiteDomain) {
      const code = generateTrackingCode(data.websiteId, data.websiteDomain);
      setTrackingCode(code);
    }
  }, [data.websiteId, data.websiteDomain]);

  const generateTrackingCode = (websiteId: string, domain: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    
    return `<!-- Oravo Analytics -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/script.js';
    script.setAttribute('data-website-id', '${websiteId}');
    script.setAttribute('data-domains', '${domain}');
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
<!-- End Oravo Analytics -->`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNext = () => {
    onNext({ trackingCode });
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>Add tracking code</h2>
        <p>Copy and paste this code into the &lt;head&gt; section of your website.</p>
      </div>

      <div className={styles.trackingCodeContainer}>
        <div className={styles.trackingCodeBox}>
          <button 
            className={styles.copyButton}
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <pre>{trackingCode}</pre>
        </div>
        
        <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--base600)' }}>
          <p><strong>Instructions:</strong></p>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Copy the code above</li>
            <li>Paste it into the &lt;head&gt; section of your website</li>
            <li>The code should be added to every page you want to track</li>
            <li>Data will start appearing in your dashboard within a few minutes</li>
          </ol>
        </div>
      </div>

      <div className={styles.actions}>
        {onBack && (
          <Button variant="quiet" onClick={onBack}>
            Back
          </Button>
        )}
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default TrackingCodeStep;